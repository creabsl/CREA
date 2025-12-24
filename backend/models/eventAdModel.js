const mongoose = require('mongoose')

const eventAdSchema = new mongoose.Schema({
  position: {
    type: String,
    enum: ['left', 'right'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
})

// Check if ad is currently valid
eventAdSchema.methods.isValid = function() {
  const now = new Date()
  if (!this.isActive) return false
  if (this.endDate && this.endDate < now) return false
  return true
}

module.exports = mongoose.model('EventAd', eventAdSchema)
