const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    // Donor Information
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    
    // Employee Information (optional)
    isEmployee: { type: Boolean, default: false },
    employeeId: { type: String },
    designation: { type: String },
    division: { type: String },
    department: { type: String },
    
    // Donation Details
    amount: { type: Number, required: true },
    purpose: { 
      type: String, 
      enum: ['general', 'education', 'welfare', 'infrastructure'],
      default: 'general'
    },
    isAnonymous: { type: Boolean, default: false },
    
    // Address (optional)
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    
    // Message (optional)
    message: { type: String },
    
    // Payment Information (to be added when payment gateway is integrated)
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentReference: { type: String },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
