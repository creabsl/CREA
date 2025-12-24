const mongoose = require('mongoose');
const suggestionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    fileNames: { type: [String], default: [] },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Suggestion', suggestionSchema);
