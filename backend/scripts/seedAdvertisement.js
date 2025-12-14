require('dotenv').config()
const mongoose = require('mongoose')
const Advertisement = require('../models/advertisementModel')
const User = require('../models/userModel')

const seedAdvertisement = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected')

    // Find an admin user (or any user to set as creator)
    const adminUser = await User.findOne({ role: 'admin' })
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.')
      process.exit(1)
    }

    // Delete existing demo advertisements
    await Advertisement.deleteMany({})

    // Create demo advertisements
    const demoAds = await Advertisement.insertMany([
      {
        title: 'Welcome to CREA Portal',
        description: 'Stay updated with the latest announcements, achievements, and important notifications from Central Railway Engineers Association. This is your central hub for all railway engineering updates.',
        type: 'announcement',
        priority: 'high',
        link: '',
        imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
        videoUrl: '',
        isActive: true,
        startDate: new Date('2025-12-14'),
        endDate: new Date('2025-12-31'),
        createdBy: adminUser._id
      },
      {
        title: 'Annual General Meeting 2025',
        description: 'Join us for the Annual General Meeting on December 28, 2025. All members are requested to attend and participate in shaping the future of CREA. Venue: CREA Head Office, Mumbai.',
        type: 'notification',
        priority: 'high',
        link: '',
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        videoUrl: '',
        isActive: true,
        startDate: new Date('2025-12-14'),
        endDate: new Date('2025-12-28'),
        createdBy: adminUser._id
      }
    ])

    console.log('Demo advertisements created successfully:')
    console.log(`Created ${demoAds.length} advertisements`)
    demoAds.forEach(ad => console.log(`- ${ad.title}`))

    process.exit(0)
  } catch (error) {
    console.error('Error seeding advertisement:', error)
    process.exit(1)
  }
}

seedAdvertisement()
