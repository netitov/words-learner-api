const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    index: true
  },
  collectionName: {
    type: String,
    required: true
  },
  style: {
    type: Object,
    required: true,
  },
  default: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

collectionSchema.index({ userId: 1, collectionName: 1 }, { unique: true });

module.exports = mongoose.model('collection', collectionSchema);
