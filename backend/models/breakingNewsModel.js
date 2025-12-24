const mongoose = require('mongoose');

const breakingNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
breakingNewsSchema.index({ isActive: 1, priority: -1, createdAt: -1 });
breakingNewsSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('BreakingNews', breakingNewsSchema);
