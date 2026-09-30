const express = require('express');
const applicationRoutes = require('./routes/application.routes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

app.use(express.json());

// Endpoints
app.use('/applications', applicationRoutes);

// Manejo centralizado de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
}

module.exports = app;