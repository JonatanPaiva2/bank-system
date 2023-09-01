const express = require("express");
const bcrypt = require("bcrypt"); //Pacote para criar hash
const jwt = require("jsonwebtoken"); //Pacote para criar token

const User = require('../models/user');
//const user = require('../models/user');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//Função Middleware
//Registro
router.post("/register", (req, res, next) => {
    console.log("Route reached");

    bcrypt.hash(req.body.password, 10) //quanto maior o número, mais seguro
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
        
        user.save() //Cria o document no banco de dados
            .then(result => {
                res.status(201).json({
                    message: 'User added sucessfully',
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        });
});

//Login
router.post("/login", (req, res, next) => {
    let fetchedUser; /////
    User.findOne({ email:req.body.email }) //Vai encontrar apenas 1 usuário
        .then(user => {
            console.log(user);
            if(!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user; /////
            //Método que compara os dados criptografados:
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            //Método que cria um novo token:
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id }, "secret_this_should_be_longer",
                { expiresIn: "1h" } //Em quando tempo o token expira (opcional)
            );
            console.log(token);
            //Envia o token:
            res.status(200).json({
                token: token,
                expiresIn: 3600 //3600s = 1h
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Auth failed"
            });
        });
});

// Rota protegida para recuperar detalhes do usuário ///////////////////////
router.get("/profile", checkAuth, (req, res, next) => {
    User.findById(req.userData.userId)  // Recupera o ID do usuário do token
        .select("name balance")         // Seleciona apenas o nome e o saldo
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

router.post('/deposit', checkAuth, async (req, res, next) => {
    try {
      const amount = req.body.amount;
      const userId = req.userData.userId;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } }, // Incrementa o saldo atual com o valor do depósito
        { new: true } // Retorna o novo documento atualizado
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.post('/withdraw', checkAuth, async (req, res, next) => {
    try {
      const amount = req.body.amount;
      const userId = req.userData.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      user.balance -= amount;
      const updatedUser = await user.save();
  
      res.status(200).json({ balance: updatedUser.balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router;