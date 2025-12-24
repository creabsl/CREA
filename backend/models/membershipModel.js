const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    membershipId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    division: { type: String, required: true },
    department: { type: String, required: true },
    place: { type: String, required: true },
    unit: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { type: String, enum: ['ordinary', 'lifetime'], required: true },
    paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking', 'qr'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentAmount: { type: Number, required: true },
    paymentDate: { type: Date },
    paymentReference: { type: String },
    
    // Razorpay Payment Fields
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    upiId: { type: String }, // For UPI payments
    
    status: { type: String, enum: ['pending', 'active', 'expired', 'rejected'], default: 'pending' },
    validFrom: { type: Date },
    validUntil: { type: Date },
    personalDetails: {
      dateOfBirth: { type: Date },
      gender: { type: String, enum: ['male', 'female', 'other'] },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    professionalDetails: {
      employeeId: { type: String },
      joiningDate: { type: Date },
      experience: { type: Number }, // in years
      specialization: { type: String },
    },
    documents: [{
      type: { type: String, enum: ['idProof', 'photo', 'signature', 'other'] },
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }],
    renewalHistory: [{
      renewalDate: { type: Date },
      paymentReference: { type: String },
      amount: { type: Number },
      type: { type: String, enum: ['new', 'renewal'] }
    }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Generate unique membership ID
membershipSchema.pre('save', async function(next) {
  if (!this.membershipId) {
    const currentYear = new Date().getFullYear();
    const count = await mongoose.model('Membership').countDocuments();
    this.membershipId = `CREA${currentYear}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Set membership validity
membershipSchema.methods.setValidity = function() {
  this.validFrom = new Date();
  if (this.type === 'lifetime') {
    this.validUntil = new Date(2099, 11, 31); // Far future date for lifetime members
  } else {
    this.validUntil = new Date(this.validFrom);
    this.validUntil.setFullYear(this.validUntil.getFullYear() + 1); // 1 year validity for ordinary members
  }
};

// Check if membership is expired
membershipSchema.methods.isExpired = function() {
  return this.validUntil && this.validUntil < new Date();
};

// Renew membership
membershipSchema.methods.renew = function(paymentReference, amount) {
  const oldValidUntil = this.validUntil;
  const startDate = this.isExpired() ? new Date() : this.validUntil;
  
  if (this.type === 'ordinary') {
    this.validUntil = new Date(startDate);
    this.validUntil.setFullYear(this.validUntil.getFullYear() + 1);
  }

  this.renewalHistory.push({
    renewalDate: new Date(),
    paymentReference,
    amount,
    type: 'renewal'
  });

  this.status = 'active';
  return this.save();
};

const Membership = mongoose.model('Membership', membershipSchema);
module.exports = Membership;
