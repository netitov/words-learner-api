const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userWordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    index: true
  },
  word: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true
  },
  translationLang: {
    type: String,
    required: true
  },
  source: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userWordSchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('userWord', userWordSchema);
