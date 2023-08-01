const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    minlength: 7,
    required: true,
    select: false,
  },
  userName: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date
  }
});

module.exports = mongoose.model('user', userSchema);
