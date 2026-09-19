const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * Bloque para mostrar todos los posts
 */
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find(); // trae todos los documentos
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
});

router.post('/', async (req, res) => {
    // console.log(req.body); Se utiliza para la respuesta del post en consola
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savedPost = await post.save(); // método que guarda en la BD
        res.json(savedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

/**
 * Bloque para mostrar solo un post por el Id
 */
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId); // encuentra por id
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
});

/**
 * Bloque para borrar un post
 */
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Post.remove({ _id: req.params.postId }); // borra
        res.json(removedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

/**
 * Actualizar un post
 */
router.patch('/:postId', async (req, res) => { // patch para actualizar
    try {
        const updatePost = await Post.updateOne( // actualiza de uno en uno
            { _id: req.params.postId },
            { $set: { title: req.body.title } });
        res.json(updatePost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;