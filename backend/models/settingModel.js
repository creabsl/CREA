const mongoose = require('mongoose');

const membershipPriceSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Membership Settings'
  }
}, {
  timestamps: true,
  collection: 'membershippricesettings'
});

module.exports = mongoose.model('MembershipPriceSetting', membershipPriceSettingSchema);
