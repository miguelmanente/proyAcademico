const express = require('express');
const path = require('path');
const app = express();

const routes = require('./routes/index');


// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', routes);

// Servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
