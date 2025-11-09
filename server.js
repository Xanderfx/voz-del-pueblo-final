// server.js - BACKEND OFICIAL VOZ DEL PUEBLO
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = "vozdelpueblo2025dominicana";

// Middleware
app.use(cors());
app.use(express.json());

// Conectar MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vozdelpueblo')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Error MongoDB:', err));

// Modelos
const User = mongoose.model('User', new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  creado: { type: Date, default: Date.now }
}));

const Categoria = mongoose.model('Categoria', new mongoose.Schema({
  nombre: String,
  descripcion: String,
  creado: { type: Date, default: Date.now }
}));

// RUTAS AUTH
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      nombre, 
      email: email.toLowerCase(), 
      password: hash 
    });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ 
      token, 
      user: { _id: user._id, nombre: user.nombre, email: user.email } 
    });
  } catch (err) {
    res.status(400).json({ msg: "Este email ya está registrado" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ 
      token, 
      user: { _id: user._id, nombre: user.nombre, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ msg: "Error del servidor" });
  }
});

// RUTAS CATEGORÍAS
app.get('/api/categorias', async (req, res) => {
  const cats = await Categoria.find().sort({ creado: -1 });
  res.json(cats);
});

app.post('/api/categorias', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const cat = await Categoria.create({ nombre, descripcion });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ msg: "Error al crear categoría" });
  }
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
  console.log(`API LISTA: http://localhost:${PORT}/api`);
  console.log(`BASE DE DATOS: vozdelpueblo`);
});