const mongoose = require('mongoose');

// Esquema que define la estructura de un usuario en la base de datos
const UserSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);