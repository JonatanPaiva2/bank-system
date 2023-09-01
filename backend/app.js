const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users");

const app = express();

//Conexão com o Banco de Dados
//mongodb+srv://<usuário>:<senha>@cluster0.4frnwjm.mongodb.net/node-angular?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://jonatan:" + process.env.MONGO_ATLAS_PW + "@cluster0.4frnwjm.mongodb.net/node-angular?retryWrites=true&w=majority") //COLOCAR ENDEREÇO DO BANCO DE DADOS
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Middleware para impedir o CORS Error
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(usersRoutes);

module.exports = app;
