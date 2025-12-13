const mongoose = require('mongoose');

const mutualTransferSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    // Current position details (auto-populated from user profile)
    currentDesignation: { type: String, required: true, trim: true },
    currentDivision: { type: String, trim: true },
    currentDepartment: { type: String, trim: true },
    currentLocation: { type: String, required: true, trim: true, index: true },
    // Desired position details
    desiredDesignation: { type: String, required: true, trim: true },
    desiredLocation: { type: String, required: true, trim: true, index: true },
    availabilityDate: { type: Date },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    // Keep legacy field for backward compatibility during migration
    post: { type: String, trim: true },
  },
  { timestamps: true }
);

mutualTransferSchema.index({ currentDesignation: 1, isActive: 1 });
mutualTransferSchema.index({ desiredDesignation: 1, isActive: 1 });

const MutualTransfer = mongoose.model('MutualTransfer', mutualTransferSchema);
module.exports = MutualTransfer;
