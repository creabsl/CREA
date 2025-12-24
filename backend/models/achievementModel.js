const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['award', 'courtCase', 'milestone'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String
  },
  photos: [{
    type: String
  }],
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

achievementSchema.index({ date: -1 });
achievementSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
