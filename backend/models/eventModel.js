const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    photos: { type: [String], default: [] },
    // Align with frontend naming
    breaking: { type: Boolean, default: false },
    // Backward/alternate field name if used elsewhere
    isBreakingNews: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
