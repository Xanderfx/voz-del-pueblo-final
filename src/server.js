require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categorias', require('./routes/categorias'));  // AQUÍ VA

app.get('/', (req, res) => {
  res.send('VOZ DEL PUEBLO API - 100% VIVA Y ORGANIZADA');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log('Voz del Pueblo LISTA para la revolución');
});
