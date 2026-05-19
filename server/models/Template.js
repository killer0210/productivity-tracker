const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'date', 'select'], default: 'text' },
    options: [String],
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    fields: [fieldSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
