const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Event = require('../models/eventModel');

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads/events');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

async function migratePhotos() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/CREA');
    console.log('Connected to MongoDB');

    // Get all events
    const events = await Event.find({});
    console.log(`Found ${events.length} events`);

    const uploadsDir = ensureUploadsDir();
    let migratedCount = 0;

    for (const event of events) {
      if (!event.photos || event.photos.length === 0) {
        console.log(`Event "${event.title}" has no photos, skipping`);
        continue;
      }

      const newPhotos = [];
      let hasBase64 = false;

      for (const photo of event.photos) {
        // Check if photo is base64 (starts with data:)
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          hasBase64 = true;
          try {
            // Extract base64 data
            const base64Data = photo.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Generate unique filename
            const filename = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpeg`;
            const filepath = path.join(uploadsDir, filename);
            
            // Write file
            fs.writeFileSync(filepath, buffer);
            console.log(`  Saved photo: ${filename}`);
            
            // Store file path instead of base64
            newPhotos.push(`/uploads/events/${filename}`);
          } catch (err) {
            console.error(`  Error converting photo for event "${event.title}":`, err.message);
            newPhotos.push(photo); // Keep original if conversion fails
          }
        } else {
          // Photo is already a file path, keep it
          newPhotos.push(photo);
        }
      }

      if (hasBase64) {
        // Update event with new photo paths
        event.photos = newPhotos;
        await event.save();
        migratedCount++;
        console.log(`Migrated event: "${event.title}" (${newPhotos.length} photos)`);
      } else {
        console.log(`Event "${event.title}" already has file paths, skipping`);
      }
    }

    console.log(`\nMigration complete! Migrated ${migratedCount} events`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

migratePhotos();
