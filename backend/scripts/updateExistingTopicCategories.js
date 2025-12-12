const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const { ForumTopic } = require('../models/forumModels')

async function updateExistingTopics() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Find all topics without a category
    const topicsWithoutCategory = await ForumTopic.find({ 
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' }
      ]
    })

    console.log(`Found ${topicsWithoutCategory.length} topics without category`)

    for (const topic of topicsWithoutCategory) {
      // Assign category based on topic title
      let category = 'general'
      
      const title = topic.title.toLowerCase()
      
      if (title.includes('training') || title.includes('resource')) {
        category = 'technical'
      } else if (title.includes('welcome')) {
        category = 'general'
      }

      topic.category = category
      await topic.save()
      console.log(`✓ Updated "${topic.title}" -> ${category}`)
    }

    console.log('\n=== Update Complete ===')
    
    const counts = {
      technical: await ForumTopic.countDocuments({ category: 'technical' }),
      social: await ForumTopic.countDocuments({ category: 'social' }),
      organizational: await ForumTopic.countDocuments({ category: 'organizational' }),
      general: await ForumTopic.countDocuments({ category: 'general' })
    }
    
    console.log('\nFinal topic counts by category:')
    console.log(`  Technical: ${counts.technical}`)
    console.log(`  Social: ${counts.social}`)
    console.log(`  Organizational: ${counts.organizational}`)
    console.log(`  General: ${counts.general}`)
    console.log(`  Total: ${counts.technical + counts.social + counts.organizational + counts.general}`)

    process.exit(0)
  } catch (error) {
    console.error('Error updating topics:', error)
    process.exit(1)
  }
}

updateExistingTopics()
