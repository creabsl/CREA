const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MembershipPriceSetting = require('../models/settingModel');

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crea';

const defaultSettings = [
  {
    key: 'membership_ordinary_price',
    value: 500,
    description: 'Price for ordinary membership (annual)',
    category: 'Membership Settings'
  },
  {
    key: 'membership_lifetime_price',
    value: 10000,
    description: 'Price for lifetime membership (one-time)',
    category: 'Membership Settings'
  }
];

async function seedSettings() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const setting of defaultSettings) {
      const existing = await MembershipPriceSetting.findOne({ key: setting.key });
      if (existing) {
        console.log(`Setting '${setting.key}' already exists, skipping...`);
      } else {
        await MembershipPriceSetting.create(setting);
        console.log(`Created setting: ${setting.key} = ${setting.value}`);
      }
    }

    console.log('Settings seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding settings:', error);
    process.exit(1);
  }
}

seedSettings();
