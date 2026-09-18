const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// RUTA DE REGISTRO
// Recibe un usuario y contraseña, encripta la contraseña y guarda el usuario en la BD
router.post('/registro', async (req, res) => {
    try {
        // Encriptamos la contraseña antes de guardarla, por seguridad
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(req.body.contraseña, salt);

        // Creamos el nuevo usuario con la contraseña ya encriptada
        const nuevoUsuario = new User({
            usuario: req.body.usuario,
            contraseña: contraseñaEncriptada
        });

        // Guardamos el usuario en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();
        res.json({ mensaje: 'Usuario registrado exitosamente', usuario: usuarioGuardado.usuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
});

// RUTA DE LOGIN
// Recibe usuario y contraseña, verifica que existan y que coincidan
router.post('/login', async (req, res) => {
    try {
        // Buscamos si el usuario existe en la base de datos
        const usuarioEncontrado = await User.findOne({ usuario: req.body.usuario });
        if (!usuarioEncontrado) {
            return res.status(400).json({ mensaje: 'Error en la autenticación' });
        }

        // Comparamos la contraseña que envió el cliente con la que está encriptada en la BD
        const contraseñaValida = await bcrypt.compare(req.body.contraseña, usuarioEncontrado.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ mensaje: 'Error en la autenticación' });
        }

        // Si el usuario existe y la contraseña coincide, la autenticación fue exitosa
        res.json({ mensaje: 'Autenticación satisfactoria' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

module.exports = router;