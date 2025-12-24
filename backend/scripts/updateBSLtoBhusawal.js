const mongoose = require('mongoose');
const BodyMember = require('../models/bodyMemberModel');
const User = require('../models/userModel');
const Membership = require('../models/membershipModel');
require('dotenv').config();

async function updateDivisionName() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Update BodyMembers
    const bodyMembersResult = await BodyMember.updateMany(
      { division: 'BSL' },
      { $set: { division: 'Bhusawal' } }
    );
    console.log(`✅ Updated ${bodyMembersResult.modifiedCount} body members from BSL to Bhusawal`);

    // Update Users
    const usersResult = await User.updateMany(
      { division: 'BSL' },
      { $set: { division: 'Bhusawal' } }
    );
    console.log(`✅ Updated ${usersResult.modifiedCount} users from BSL to Bhusawal`);

    // Update Memberships
    const membershipsResult = await Membership.updateMany(
      { division: 'BSL' },
      { $set: { division: 'Bhusawal' } }
    );
    console.log(`✅ Updated ${membershipsResult.modifiedCount} memberships from BSL to Bhusawal`);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

updateDivisionName();
