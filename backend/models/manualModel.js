const mongoose = require('mongoose');
const manualSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date }, // date of manual
    subject: { type: String }, // subject or description
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
