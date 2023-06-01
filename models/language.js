const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  language: String,
  code: String
});

module.exports = mongoose.model('language', languageSchema);
