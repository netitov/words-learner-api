const mongoose = require('mongoose');

const apicallsSchema = new mongoose.Schema({
  date: String,
  words: Number
});

module.exports = mongoose.model('apicall', apicallsSchema);
