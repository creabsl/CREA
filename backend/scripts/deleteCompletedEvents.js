const mongoose = require('mongoose');
const Event = require('../models/eventModel');
require('dotenv').config();

const deleteCompletedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all events with dates before today
    const completedEvents = await Event.find({ date: { $lt: today } });
    console.log(`Found ${completedEvents.length} completed events`);

    if (completedEvents.length > 0) {
      console.log('\nCompleted events to be deleted:');
      completedEvents.forEach(event => {
        console.log(`- ${event.title} (${event.date.toDateString()})`);
      });

      // Delete all completed events
      const result = await Event.deleteMany({ date: { $lt: today } });
      console.log(`\n✓ Successfully deleted ${result.deletedCount} completed events`);
    } else {
      console.log('No completed events found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

deleteCompletedEvents();
