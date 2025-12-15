const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

async function dropPositionIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✓ Connected to MongoDB')

    // Get the EventAd collection
    const collection = mongoose.connection.collection('eventads')

    // Drop the unique index on position field
    try {
      await collection.dropIndex('position_1')
      console.log('✓ Successfully dropped position_1 unique index')
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('✓ Index position_1 does not exist (already dropped)')
      } else {
        throw error
      }
    }

    // List all indexes to verify
    const indexes = await collection.indexes()
    console.log('\nCurrent indexes on eventads collection:')
    indexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index.key)}`)
    })

    console.log('\n✓ Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error:', error.message)
    process.exit(1)
  }
}

dropPositionIndex()
