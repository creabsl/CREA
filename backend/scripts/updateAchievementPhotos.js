require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('../models/achievementModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://railway:railway@cluster0.bvyozxr.mongodb.net/crea?retryWrites=true&w=majority';

async function updateAchievementPhotos() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the 75 Years of Excellence achievement
    const milestone = await Achievement.findOne({ 
      type: 'milestone',
      title: /75 Years/i 
    });

    if (!milestone) {
      console.log('❌ Milestone achievement not found');
      process.exit(1);
    }

    // Add photo gallery
    milestone.photos = [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800'
    ];

    await milestone.save();

    console.log(`✅ Updated milestone achievement with ${milestone.photos.length} photos`);
    console.log('🎉 Update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating achievement:', error);
    process.exit(1);
  }
}

updateAchievementPhotos();
