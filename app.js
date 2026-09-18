require('dotenv').config();

// Iniciamos el módulo express con el fin de dar inicio al servidor,
// evitando varias configuraciones
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Llamar al body-parser
app.use(bodyParser.json());

// Importar las rutas
const postRoute = require('./routes/post');
app.use('/servicios', postRoute);

// Importar las rutas de autenticación (registro y login)
const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

// Se crean las rutas
app.get('/', (req, res) => {
    res.send('prueba 1 respuesta del servidor'); // Ruta por defecto
});

// Conexión a la BD
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Sí hay conexión a la BD');
    })
    .catch((error) => {
        console.log('Error al conectar:', error);
    });

// Finalmente se configura cómo va a escuchar el servidor las peticiones
app.listen(3001);