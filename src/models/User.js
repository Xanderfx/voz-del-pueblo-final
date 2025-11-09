const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'moderador', 'admin'], default: 'usuario' },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
