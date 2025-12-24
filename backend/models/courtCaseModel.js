const mongoose = require('mongoose');
const courtCaseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, required: true },
    date: { type: Date, required: true },
    subject: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('CourtCase', courtCaseSchema);
