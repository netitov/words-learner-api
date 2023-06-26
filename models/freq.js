const mongoose = require('mongoose');

const freqSchema = new mongoose.Schema({
  word: String,
  fr: String,
});

module.exports = mongoose.model('freq', freqSchema);
