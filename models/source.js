const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  id: String,
  title: String,
  group: String,
  added: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('source', sourceSchema);
