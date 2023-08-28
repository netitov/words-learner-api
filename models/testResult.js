const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  /* wordId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'userWord',
  },
  result: {
    type: Boolean,
    required: true,
  }, */
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('testResult', testResultSchema);
