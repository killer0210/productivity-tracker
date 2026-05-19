const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: { type: String, default: '' },
    where: { type: String, default: '' },
    what: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    entryDate: { type: Date, required: true, index: true },
    rawTranscript: { type: String, default: '' },
    isReviewed: { type: Boolean, default: false },
    customFields: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

entrySchema.index({ userId: 1, entryDate: -1 });

module.exports = mongoose.model('Entry', entrySchema);
