const mongoose = require('mongoose');
const { userNameLengthMin, userNameLengthMax, passwordLengthMin } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    minlength: passwordLengthMin,
    required: true,
    select: false,
  },
  userName: {
    type: String,
    minlength: userNameLengthMin,
    maxlength: userNameLengthMax,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date
  }
});

module.exports = mongoose.model('user', userSchema);
