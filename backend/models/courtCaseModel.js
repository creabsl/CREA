const mongoose = require('mongoose');
const courtCaseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, required: true },
    date: { type: Date, required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['pending', 'ongoing', 'closed'], default: 'ongoing' },
    url: { type: String }, // external or local file URL
    fileName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);
module.exports = mongoose.model('CourtCase', courtCaseSchema);
