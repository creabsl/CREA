const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Source and destination URIs from environment variables
// Set these in your .env file or pass as command line arguments:
// SOURCE_MONGO_URI - The source MongoDB connection string
// DEST_MONGO_URI - The destination MongoDB connection string (defaults to MONGO_URI from .env)
const SOURCE_URI = process.env.SOURCE_MONGO_URI || process.argv[2];
const DEST_URI = process.env.DEST_MONGO_URI || process.env.MONGO_URI || process.argv[3];

async function migrateDatabase() {
  if (!SOURCE_URI || !DEST_URI) {
    console.error('❌ Error: Missing database URIs');
    console.log('\nUsage:');
    console.log('  Set environment variables SOURCE_MONGO_URI and DEST_MONGO_URI');
    console.log('  OR run: node migrateDatabase.js <source-uri> <dest-uri>');
    process.exit(1);
  }
  console.log('Starting database migration...\n');

  // Create separate connections
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  const destConn = await mongoose.createConnection(DEST_URI).asPromise();

  console.log('Connected to both databases\n');

  try {
    // Get all collections from source database
    const collections = await sourceConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate\n`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Migrating collection: ${collectionName}`);

      // Get all documents from source collection
      const sourceCollection = sourceConn.db.collection(collectionName);
      const documents = await sourceCollection.find({}).toArray();

      console.log(`  - Found ${documents.length} documents`);

      if (documents.length > 0) {
        // Insert documents into destination collection
        const destCollection = destConn.db.collection(collectionName);
        
        // Clear destination collection first (optional - comment out if you want to preserve existing data)
        await destCollection.deleteMany({});
        
        // Insert documents one by one to handle duplicates
        let successCount = 0;
        let errorCount = 0;
        
        for (const doc of documents) {
          try {
            await destCollection.insertOne(doc);
            successCount++;
          } catch (error) {
            if (error.code === 11000) {
              console.log(`  - Skipped duplicate document with _id: ${doc._id}`);
              errorCount++;
            } else {
              throw error;
            }
          }
        }
        
        console.log(`  - Successfully migrated ${successCount} documents`);
        if (errorCount > 0) {
          console.log(`  - Skipped ${errorCount} duplicate documents`);
        }
        console.log();
      } else {
        console.log(`  - No documents to migrate\n`);
      }
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    // Close connections
    await sourceConn.close();
    await destConn.close();
    console.log('\nConnections closed');
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('\n🎉 Database migration finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
