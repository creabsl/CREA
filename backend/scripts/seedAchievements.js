require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('../models/achievementModel');
const User = require('../models/userModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://railway:railway@cluster0.bvyozxr.mongodb.net/crea?retryWrites=true&w=majority';

const sampleAchievements = [
  {
    type: 'award',
    title: 'Best Railway Association Award 2024',
    description: 'CREA received the prestigious Best Railway Association Award for outstanding contribution to railway engineering excellence and member welfare.',
    date: new Date('2024-11-15'),
    category: 'Excellence Award',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
    isActive: true
  },
  {
    type: 'courtCase',
    title: 'Major Victory in Promotion Policy Case',
    description: 'Won landmark case securing fair promotion policies for all railway engineers. The court ruled in favor of merit-based promotions.',
    date: new Date('2024-10-20'),
    category: 'Legal Victory',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    isActive: true
  },
  {
    type: 'milestone',
    title: '75 Years of Excellence',
    description: 'CREA celebrated 75 years of serving railway engineers since its establishment in 1950. A grand celebration was organized with all divisions.',
    date: new Date('2024-09-10'),
    category: 'Anniversary',
    photos: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
    ],
    isActive: true
  },
  {
    type: 'courtCase',
    title: 'Pension Benefits Case Won',
    description: 'Successfully secured enhanced pension benefits for retired railway engineers through court verdict.',
    date: new Date('2024-08-05'),
    category: 'Welfare Victory',
    isActive: true
  },
  {
    type: 'award',
    title: 'Safety Innovation Award',
    description: 'Received national recognition for implementing innovative safety measures across Central Railway divisions.',
    date: new Date('2024-07-12'),
    category: 'Innovation Award',
    imageUrl: 'https://images.unsplash.com/photo-1541420937988-702d78cb9fa1?w=800',
    isActive: true
  },
  {
    type: 'milestone',
    title: '10,000+ Active Members',
    description: 'CREA reached the milestone of 10,000+ active members across all divisions, making it one of the largest railway associations.',
    date: new Date('2024-06-01'),
    category: 'Growth Milestone',
    isActive: true
  },
  {
    type: 'award',
    title: 'Engineer Excellence Award',
    description: 'Railway Engineering Excellence recognized at national level conference.',
    date: new Date('2024-05-15'),
    category: 'Excellence Award',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    isActive: true
  },
  {
    type: 'milestone',
    title: 'New Technical Training Center',
    description: 'Inauguration of state-of-the-art technical training center for railway engineers in Bhusawal.',
    date: new Date('2024-04-20'),
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    isActive: true
  },
  {
    type: 'courtCase',
    title: 'Working Hours Policy Victory',
    description: 'Court ruled in favor of reasonable working hours and overtime compensation for railway engineers.',
    date: new Date('2024-03-10'),
    category: 'Legal Victory',
    isActive: true
  },
  {
    type: 'award',
    title: 'Community Service Recognition',
    description: 'CREA recognized for outstanding community service and social welfare initiatives.',
    date: new Date('2024-02-18'),
    category: 'Service Award',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    isActive: true
  },
  {
    type: 'milestone',
    title: 'Digital Transformation Initiative',
    description: 'Successfully completed digital transformation of all CREA operations and member services.',
    date: new Date('2024-01-25'),
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    isActive: true
  },
  {
    type: 'award',
    title: 'Best Practice Award for Member Welfare',
    description: 'Received recognition for innovative member welfare programs and benefits.',
    date: new Date('2023-12-05'),
    category: 'Welfare Award',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    isActive: true
  }
];

async function seedAchievements() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to set as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log('🗑️  Clearing existing achievements...');
    await Achievement.deleteMany({});

    console.log('🌱 Seeding achievements...');
    const achievementsWithCreator = sampleAchievements.map(a => ({
      ...a,
      createdBy: adminUser._id
    }));

    const created = await Achievement.insertMany(achievementsWithCreator);
    console.log(`✅ Created ${created.length} achievements:`);
    created.forEach(a => {
      console.log(`   - ${a.type.toUpperCase()}: ${a.title}`);
    });

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
    process.exit(1);
  }
}

seedAchievements();
