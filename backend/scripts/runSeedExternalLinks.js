const mongoose = require('mongoose');
const { seedExternalLinks } = require('./seedExternalLinks');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const count = await seedExternalLinks();
    console.log(`✓ Successfully seeded ${count} external links`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
