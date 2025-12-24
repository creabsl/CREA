const mongoose = require('mongoose');
const manualSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String }, // external or local file URL
    fileName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    category: { 
      type: String, 
      enum: ['technical', 'social', 'organizational', 'general'], 
      default: 'general' 
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Manual', manualSchema);
