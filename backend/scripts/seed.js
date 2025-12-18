const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const Event = require('../models/eventModel')
const { ForumTopic, ForumPost } = require('../models/forumModels')
const Circular = require('../models/circularModel')
const Manual = require('../models/manualModel')
const CourtCase = require('../models/courtCaseModel')
const Suggestion = require('../models/suggestionModel')
const User = require('../models/userModel')
const { seedExternalLinks } = require('./seedExternalLinks')

async function seedDemoData() {
  const ops = []
  const result = { events: 0, topics: 0, posts: 0, circulars: 0, manuals: 0, courtCases: 0, suggestions: 0, externalLinks: 0 }

  // Ensure an admin user exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@crea.local'
  const adminPass = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const existingAdmin = await User.findOne({ role: 'admin' })
  if (!existingAdmin) {
    try {
      await User.create({ name: 'Administrator', email: adminEmail, password: adminPass, role: 'admin' })
      console.log(`Seeded admin user: ${adminEmail}`)
    } catch (e) {
      console.warn('Failed to seed admin user (may already exist):', e?.message || e)
    }
  } else if (String(process.env.ADMIN_FORCE_RESET).toLowerCase() === 'true') {
    try {
      existingAdmin.email = adminEmail
      existingAdmin.password = adminPass // will be hashed by pre-save
      await existingAdmin.save()
      console.log(`Admin user reset to: ${adminEmail}`)
    } catch (e) {
      if (e && e.code === 11000) {
        console.warn('Admin reset failed: email already in use by another account.')
      } else {
        console.warn('Admin reset failed:', e?.message || e)
      }
    }
  }

  if (await Event.countDocuments() === 0) {
    const docs = [
      // Breaking/Current Events
      { title: 'Annual General Meeting', description: 'AGM for all members', date: new Date(), location: 'Mumbai HQ', breaking: true, photos: [] },
      
      // Upcoming Events
      { title: 'Safety Workshop', description: 'Best practices and safety measures', date: new Date(Date.now()+7*86400000), location: 'Pune Division', photos: [] },
      { title: 'Technical Seminar', description: 'Latest railway engineering trends', date: new Date(Date.now()+14*86400000), location: 'Nagpur', photos: [] },
      { title: 'Annual Sports Meet', description: 'Inter-division sports competition for all railway employees', date: new Date(Date.now()+21*86400000), location: 'CSMT Sports Ground', photos: [] },
      
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
    ops.push(Event.insertMany(docs))
    result.events = docs.length
  }

  if (await ForumTopic.countDocuments() === 0) {
    const topics = await ForumTopic.insertMany([
      { title: 'Welcome to CREA Forum', author: 'Admin', createdAtStr: new Date().toISOString(), replies: 2 },
      { title: 'Share training resources', author: 'Ramesh', createdAtStr: new Date().toISOString(), replies: 1 },
    ])
    result.topics = topics.length
    await ForumPost.insertMany([
      { topicId: topics[0]._id, author: 'Admin', content: 'Use this space to collaborate.', createdAtStr: new Date().toISOString() },
      { topicId: topics[0]._id, author: 'Sita', content: 'Happy to be here!', createdAtStr: new Date().toISOString() },
      { topicId: topics[1]._id, author: 'Ramesh', content: 'Posting a link to manuals soon.', createdAtStr: new Date().toISOString() },
    ])
    result.posts = 3
  }

  if (await Circular.countDocuments() === 0) {
    const docs = [
      { boardNumber: 'CR/2025/001', subject: 'New safety guidelines', dateOfIssue: new Date(), url: 'https://example.com/circulars/CR-2025-001.pdf' },
      { boardNumber: 'CR/2025/002', subject: 'Updated leave policy', dateOfIssue: new Date(Date.now()-5*86400000), url: 'https://example.com/circulars/CR-2025-002.pdf' },
    ]
    ops.push(Circular.insertMany(docs))
    result.circulars = docs.length
  }

  if (await Manual.countDocuments() === 0) {
    const docs = [
      { title: 'Engineering Standards Manual', url: 'https://example.com/manuals/standards.pdf' },
      { title: 'Electrical Safety Manual', url: 'https://example.com/manuals/electrical-safety.pdf' },
    ]
    ops.push(Manual.insertMany(docs))
    result.manuals = docs.length
  }

  if (await CourtCase.countDocuments() === 0) {
    const docs = [
      { caseNumber: 'CC-2025-15', date: new Date(Date.now()-10*86400000), subject: 'Contract dispute' },
      { caseNumber: 'CC-2025-27', date: new Date(Date.now()-2*86400000), subject: 'Labor arbitration' },
    ]
    ops.push(CourtCase.insertMany(docs))
    result.courtCases = docs.length
  }

  if (await Suggestion.countDocuments() === 0) {
    const docs = [
      { userId: 'demo1', userName: 'A. Sharma', text: 'Add dark mode to the portal', fileNames: [] },
      { userId: 'demo2', userName: 'R. Gupta', text: 'Create a mentorship program', fileNames: [] },
    ]
    ops.push(Suggestion.insertMany(docs))
    result.suggestions = docs.length
  }

  // Seed external links
  result.externalLinks = await seedExternalLinks();

  await Promise.all(ops)
  return result
}

module.exports = { seedDemoData }

// CLI usage: node scripts/seed.js
if (require.main === module) {
  (async () => {
    try {
      await connectDB()
      const r = await seedDemoData()
      const total = Object.values(r).reduce((a, b) => a + b, 0)
      if (total > 0) console.log('Demo data seeding complete.')
      else console.log('Demo data already present; nothing inserted.')
      await mongoose.connection.close()
    } catch (e) {
      console.error('Seed failed:', e)
      try { await mongoose.connection.close() } catch {}
      process.exit(1)
    }
  })()
}
