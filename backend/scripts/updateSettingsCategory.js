const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Setting = require('../models/settingModel');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crea';

async function updateCategory() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update category from 'membership' to 'Membership Settings'
    const result = await Setting.updateMany(
      { category: 'membership' },
      { $set: { category: 'Membership Settings' } }
    );

    console.log(`\n📝 Updated ${result.modifiedCount} setting(s)`);

    // Display current settings
    const settings = await Setting.find({ category: 'Membership Settings' });
    console.log('\n💰 Current Membership Settings:');
    settings.forEach(s => {
      console.log(`   • ${s.key}: ₹${s.value}`);
      console.log(`     Description: ${s.description}`);
      console.log(`     Category: ${s.category}\n`);
    });

    console.log('✅ Category updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCategory();
