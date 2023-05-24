const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: String,
  fl: String,
  audio: String,
  sum: Number
});

module.exports = mongoose.model('word', wordSchema);
