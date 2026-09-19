const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// RUTA PARA LISTAR TODOS LOS USUARIOS
router.get('/', async (req, res) => {
    try {
        const usuarios = await User.find().select('-contraseña');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
});

// RUTA PARA BUSCAR UN USUARIO POR ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id).select('-contraseña');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar usuario', error: error.message });
    }
});

// RUTA DE REGISTRO
router.post('/registro', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(req.body.contraseña, salt);

        const nuevoUsuario = new User({
            usuario: req.body.usuario,
            contraseña: contraseñaEncriptada
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.json({ mensaje: 'Usuario registrado exitosamente', usuario: usuarioGuardado.usuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
});

// RUTA DE LOGIN
router.post('/login', async (req, res) => {
    try {
        const usuarioEncontrado = await User.findOne({ usuario: req.body.usuario });
        if (!usuarioEncontrado) {
            return res.status(400).json({ mensaje: 'Error en la autenticación' });
        }

        const contraseñaValida = await bcrypt.compare(req.body.contraseña, usuarioEncontrado.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json({ mensaje: 'Error en la autenticación' });
        }

        res.json({ mensaje: 'Autenticación satisfactoria' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

// RUTA PARA ACTUALIZAR UN USUARIO
router.patch('/:id', async (req, res) => {
    try {
        const camposActualizar = {};

        // Solo actualiza el nombre de usuario si lo mandaron en el body
        if (req.body.usuario) {
            camposActualizar.usuario = req.body.usuario;
        }

        // Si mandan una nueva contraseña, la encriptamos antes de guardarla
        if (req.body.contraseña) {
            const salt = await bcrypt.genSalt(10);
            camposActualizar.contraseña = await bcrypt.hash(req.body.contraseña, salt);
        }

        const usuarioActualizado = await User.updateOne(
            { _id: req.params.id },
            { $set: camposActualizar }
        );

        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
    }
});

// RUTA PARA BORRAR UN USUARIO
router.delete('/:id', async (req, res) => {
    try {
        const usuarioBorrado = await User.findByIdAndDelete(req.params.id);
        if (!usuarioBorrado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente', usuario: usuarioBorrado.usuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
    }
});

module.exports = router; 