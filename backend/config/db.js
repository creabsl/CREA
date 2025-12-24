const mongoose = require('mongoose');

const connectDB = async () => {
  // Trim and strip accidental surrounding quotes from the URI
  const raw = process.env.MONGO_URI || '';
  const mongoUri = raw.trim().replace(/^"([\s\S]*)"$/,'$1').replace(/^'([\s\S]*)'$/,'$1');
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  try {
    // Quick scheme validation for friendlier errors
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"');
    }

    const conn = await mongoose.connect(mongoUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`✓ MongoDB connected`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
