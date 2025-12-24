const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const { ForumTopic, ForumPost } = require('../models/forumModels')

const forumTopicsData = [
  // Technical Topics
  {
    title: 'Best practices for railway signal maintenance',
    author: 'Rajesh Kumar',
    category: 'technical',
    replies: 0,
    posts: [
      { author: 'Rajesh Kumar', content: 'What are the latest best practices for maintaining railway signaling systems? Looking for input from experienced engineers.' }
    ]
  },
  {
    title: 'Overhead electrification troubleshooting guide',
    author: 'Priya Sharma',
    category: 'technical',
    replies: 0,
    posts: [
      { author: 'Priya Sharma', content: 'Starting a thread to compile common issues and solutions for OHE systems. Please share your experiences!' }
    ]
  },
  {
    title: 'Track maintenance scheduling optimization',
    author: 'Amit Patel',
    category: 'technical',
    replies: 0,
    posts: [
      { author: 'Amit Patel', content: 'How do you optimize maintenance schedules to minimize disruption while ensuring safety? Share your strategies.' }
    ]
  },
  {
    title: 'New rolling stock technology discussion',
    author: 'Deepak Singh',
    category: 'technical',
    replies: 0,
    posts: [
      { author: 'Deepak Singh', content: 'Let\'s discuss the latest advancements in rolling stock technology and their implementation in Indian Railways.' }
    ]
  },
  {
    title: 'Safety protocols for high-speed rail operations',
    author: 'Meera Reddy',
    category: 'technical',
    replies: 0,
    posts: [
      { author: 'Meera Reddy', content: 'With Vande Bharat and upcoming high-speed projects, what additional safety measures should we consider?' }
    ]
  },

  // Social Topics
  {
    title: 'CREA Annual Sports Meet 2025',
    author: 'Suresh Deshmukh',
    category: 'social',
    replies: 0,
    posts: [
      { author: 'Suresh Deshmukh', content: 'Planning for our annual sports event! Suggestions for sports events and venue welcome.' }
    ]
  },
  {
    title: 'Family Day celebration ideas',
    author: 'Kavita Joshi',
    category: 'social',
    replies: 0,
    posts: [
      { author: 'Kavita Joshi', content: 'Let\'s organize a memorable family day event for CREA members. What activities should we include?' }
    ]
  },
  {
    title: 'Photography club - Railway heritage sites',
    author: 'Anil Verma',
    category: 'social',
    replies: 0,
    posts: [
      { author: 'Anil Verma', content: 'Interested in documenting historic railway structures? Let\'s form a photography group!' }
    ]
  },
  {
    title: 'Book club - Engineering and leadership reads',
    author: 'Pooja Malhotra',
    category: 'social',
    replies: 0,
    posts: [
      { author: 'Pooja Malhotra', content: 'Starting a book club for engineers. First book suggestion: "The Innovators" by Walter Isaacson.' }
    ]
  },
  {
    title: 'Retirement celebration planning',
    author: 'Ramesh Iyer',
    category: 'social',
    replies: 0,
    posts: [
      { author: 'Ramesh Iyer', content: 'Let\'s honor our retiring colleagues properly. Share your ideas for a meaningful farewell event.' }
    ]
  },

  // Organizational Topics
  {
    title: 'CREA membership drive 2025',
    author: 'Secretary CREA',
    category: 'organizational',
    replies: 0,
    posts: [
      { author: 'Secretary CREA', content: 'Launching our annual membership drive. Let\'s work together to increase our membership base.' }
    ]
  },
  {
    title: 'Proposal: Monthly technical bulletin',
    author: 'Vikram Rao',
    category: 'organizational',
    replies: 0,
    posts: [
      { author: 'Vikram Rao', content: 'Should CREA start publishing a monthly technical bulletin? Looking for volunteers and feedback.' }
    ]
  },
  {
    title: 'Division-wise coordinator nominations',
    author: 'President CREA',
    category: 'organizational',
    replies: 0,
    posts: [
      { author: 'President CREA', content: 'We need active coordinators for each division. Please nominate yourself or suggest names.' }
    ]
  },
  {
    title: 'CREA constitution amendment suggestions',
    author: 'Legal Committee',
    category: 'organizational',
    replies: 0,
    posts: [
      { author: 'Legal Committee', content: 'Open thread for suggesting amendments to our constitution. All proposals will be reviewed by the committee.' }
    ]
  },
  {
    title: 'Annual budget allocation discussion',
    author: 'Treasurer CREA',
    category: 'organizational',
    replies: 0,
    posts: [
      { author: 'Treasurer CREA', content: 'Let\'s discuss how to allocate our annual budget across various activities and initiatives.' }
    ]
  },
  {
    title: 'Collaboration with other railway associations',
    author: 'External Relations',
    category: 'organizational',
    replies: 0,
    posts: [
      { author: 'External Relations', content: 'Exploring partnerships with other railway engineering associations. Thoughts and suggestions?' }
    ]
  },

  // General Topics
  {
    title: 'Welcome to CREA Forum',
    author: 'Admin',
    category: 'general',
    replies: 0,
    posts: [
      { author: 'Admin', content: 'Welcome to the CREA discussion forum! This is your space to connect, collaborate, and share knowledge with fellow railway engineers. Feel free to start new discussions and participate in existing ones.' }
    ]
  },
  {
    title: 'Forum guidelines and best practices',
    author: 'Admin',
    category: 'general',
    replies: 0,
    posts: [
      { author: 'Admin', content: 'Please maintain professional decorum in all discussions. Respect diverse opinions and focus on constructive dialogue. Report any inappropriate content to moderators.' }
    ]
  }
]

async function seedForumTopics() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing forum topics and posts
    const existingCount = await ForumTopic.countDocuments()
    console.log(`Found ${existingCount} existing forum topics`)
    
    const shouldDelete = process.argv.includes('--clear')
    if (shouldDelete) {
      await ForumPost.deleteMany({})
      await ForumTopic.deleteMany({})
      console.log('Cleared existing forum data')
    }

    let createdTopics = 0
    let createdPosts = 0

    for (const topicData of forumTopicsData) {
      const { posts, replies, ...topicFields } = topicData
      
      // Check if topic already exists
      const existing = await ForumTopic.findOne({ title: topicFields.title })
      if (existing) {
        console.log(`Topic already exists: ${topicFields.title}`)
        continue
      }

      // Create topic
      const topic = await ForumTopic.create({
        ...topicFields,
        createdAtStr: new Date().toISOString(),
        replies: posts.length
      })
      createdTopics++

      // Create posts for this topic
      for (const postData of posts) {
        await ForumPost.create({
          topicId: topic._id,
          ...postData,
          createdAtStr: new Date().toISOString(),
          approved: true // Auto-approve seed posts
        })
        createdPosts++
      }

      console.log(`✓ Created topic: ${topicFields.title} (${topicFields.category})`)
    }

    console.log('\n=== Seeding Complete ===')
    console.log(`Created ${createdTopics} forum topics`)
    console.log(`Created ${createdPosts} forum posts`)
    
    const finalCounts = {
      technical: await ForumTopic.countDocuments({ category: 'technical' }),
      social: await ForumTopic.countDocuments({ category: 'social' }),
      organizational: await ForumTopic.countDocuments({ category: 'organizational' }),
      general: await ForumTopic.countDocuments({ category: 'general' })
    }
    
    console.log('\nTopics by category:')
    console.log(`  Technical: ${finalCounts.technical}`)
    console.log(`  Social: ${finalCounts.social}`)
    console.log(`  Organizational: ${finalCounts.organizational}`)
    console.log(`  General: ${finalCounts.general}`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding forum topics:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  seedForumTopics()
}

module.exports = { seedForumTopics }
