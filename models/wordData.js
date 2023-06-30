const mongoose = require('mongoose');

const wordDataSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true
  },
  pos: {
    type: String,
    required: true
  },
  filmPer: {
    type: Number,
    required: true
  },
  fr: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('wordData', wordDataSchema);
