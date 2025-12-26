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
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true
    });
    
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✓ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
