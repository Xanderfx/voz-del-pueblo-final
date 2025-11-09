const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Categoria = require('../models/Categoria');

// @route   GET /api/categorias
// @desc    Listar todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ createdAt: -1 });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   POST /api/categorias
// @desc    Crear categoría (solo logueados)
router.post('/', auth, async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    let categoria = await Categoria.findOne({ nombre });
    if (categoria) return res.status(400).json({ msg: 'Esa categoría ya existe' });

    categoria = new Categoria({
      nombre,
      descripcion,
      creador: req.user.id
    });

    await categoria.save();
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;