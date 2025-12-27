require("dotenv").config();
const mongoose = require("mongoose");
const PastEvent = require("../models/pastEventModel");

async function clearPastEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await PastEvent.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} old past events`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearPastEvents();
