const mongoose = require('mongoose');
const circularSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String },
    dateOfIssue: { type: Date, required: true },
    url: { type: String }, // external or local file URL
    fileName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Circular', circularSchema);
