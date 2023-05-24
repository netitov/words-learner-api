const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  sourceId: String,
  words: Object
});

module.exports = mongoose.model('queue', queueSchema);
