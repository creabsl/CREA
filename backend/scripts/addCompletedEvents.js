const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const Event = require('../models/eventModel')

async function addCompletedEvents() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')
    
    // Delete old seed events that might be duplicates
    await Event.deleteMany({ 
      title: { 
        $in: ['Safety Workshop', 'Technical Seminar', 'Annual Sports Meet'] 
      } 
    })
    
    const completedEvents = [
      // Upcoming Events
      { 
        title: 'Safety Workshop', 
        description: 'Best practices and safety measures', 
        date: new Date(Date.now()+7*86400000), 
        location: 'Pune Division', 
        photos: [] 
      },
      { 
        title: 'Technical Seminar', 
        description: 'Latest railway engineering trends', 
        date: new Date(Date.now()+14*86400000), 
        location: 'Nagpur', 
        photos: [] 
      },
      { 
        title: 'Annual Sports Meet', 
        description: 'Inter-division sports competition for all railway employees', 
        date: new Date(Date.now()+21*86400000), 
        location: 'CSMT Sports Ground', 
        photos: [] 
      },
      
      // Completed Events
      { 
        title: 'Engineer\'s Day', 
        description: 'On the occasion of Engineers\' Day, our dynamic "Working President (AIREF) Er. M.K. Pandey" and the dedicated team from CR Mumbai — Er. Amit Tadvi, Er. Sachin Kolte, Er. Hemant Patil, and Er. Prajwalit Kharade — had the privilege to meet "Shri Navin Gulati ( Member Infra) Sir" at Railway Board New Delhi.🙏 🎉 "M.I Sir", has inaugurated the first "e-Engineer Times" released by "A.I.R.E.F" . on Engineers Day-— a proud moment for all of us! 📰 📚 The team also conveyed heartfelt birthday wishes to M.I.Navin Gulati Sir on behalf of AIREF . 🎂 🎁', 
        date: new Date('2025-09-14'), 
        location: 'CSMT Mumbai', 
        photos: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
          'https://images.unsplash.com/photo-1559223607-a43c990e7d1e?w=500',
          'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
          'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500'
        ] 
      },
      { 
        title: 'Gandhi Jayanti', 
        description: 'Celebration of Mahatma Gandhi\'s birth anniversary with special programs on non-violence and nation-building. Members participated in cleanliness drive and community service activities.', 
        date: new Date('2025-10-02'), 
        location: 'All Divisions', 
        photos: [
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500',
          'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=500',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500'
        ] 
      },
      { 
        title: 'Independence Day Celebration', 
        description: 'Flag hoisting ceremony and cultural programs organized at all railway divisions. Railway officials and staff members celebrated the 78th Independence Day with great enthusiasm.', 
        date: new Date('2025-08-15'), 
        location: 'All Railway Divisions', 
        photos: [
          'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=500',
          'https://images.unsplash.com/photo-1565552645994-1331a7efd7ee?w=500'
        ] 
      },
      { 
        title: 'Summer Technical Workshop', 
        description: 'Five-day intensive workshop on latest railway engineering technologies including track maintenance, signaling systems, and safety protocols. Over 100 engineers participated.', 
        date: new Date('2025-06-20'), 
        location: 'Mumbai Division Training Center', 
        photos: [
          'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=500',
          'https://images.unsplash.com/photo-1558403194-611308249627?w=500',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500'
        ] 
      }
    ]
    
    const result = await Event.insertMany(completedEvents)
    console.log(`✓ Added ${result.length} events (${completedEvents.filter(e => new Date(e.date) < new Date()).length} completed, ${completedEvents.filter(e => new Date(e.date) >= new Date()).length} upcoming)`)
    
    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('Error adding completed events:', error)
    process.exit(1)
  }
}

addCompletedEvents()
