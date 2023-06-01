const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
  languages: String
});

module.exports = mongoose.model('dictionarie', dictionarySchema);
