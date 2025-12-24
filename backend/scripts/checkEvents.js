const mongoose = require('mongoose');
const Event = require('../models/eventModel');

async function checkEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crea');
    console.log('Connected to MongoDB');
    
    const events = await Event.find().sort({ date: -1 });
    console.log(`\nTotal events in database: ${events.length}\n`);
    
    events.forEach((e, i) => {
      const date = e.date ? new Date(e.date) : new Date(e.createdAt);
      const isBreaking = e.breaking || e.isBreakingNews || false;
      console.log(`${i+1}. ${e.title}`);
      console.log(`   ID: ${e._id}`);
      console.log(`   Date: ${date.toISOString()}`);
      console.log(`   Location: ${e.location || 'N/A'}`);
      console.log(`   Breaking: ${isBreaking}`);
      console.log(`   Photos: ${e.photos ? e.photos.length : 0}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEvents();
