const mongoose = require('mongoose');

const bodyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    photoUrl: {
      type: String,
      required: [true, 'Photo is required']
    },
    division: {
      type: String,
      required: [true, 'Division is required'],
      enum: ['BSL', 'Pune', 'Solapur', 'Nagpur', 'Mumbai']
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster division-based queries
bodyMemberSchema.index({ division: 1 });

module.exports = mongoose.model('BodyMember', bodyMemberSchema);
