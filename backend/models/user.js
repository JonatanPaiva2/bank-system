const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //plug in para validar valores unicos

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

userSchema.plugin(uniqueValidator); //plug in para validar valores unicos

module.exports = mongoose.model('User', userSchema);