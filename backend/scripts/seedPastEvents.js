require("dotenv").config();
const mongoose = require("mongoose");
const PastEvent = require("../models/pastEventModel");

const defaultPastEvents = [
  {
    title: "Annual Technical Seminar 2024",
    type: "photo",
    thumbnail:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    description:
      "A comprehensive technical seminar bringing together railway engineers to discuss latest innovations and best practices.",
    date: "March 2024",
    order: 1,
  },
  {
    title: "Safety Workshop Mumbai Division",
    type: "photo",
    thumbnail:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400",
    description:
      "Intensive safety training workshop conducted for Mumbai division engineers focusing on modern safety protocols.",
    date: "February 2024",
    order: 2,
  },
  {
    title: "Railway Modernization Conference",
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400",
    description:
      "National conference on railway modernization featuring expert speakers and interactive sessions on future technologies.",
    date: "January 2024",
    order: 3,
  },
  {
    title: "Member Felicitation Ceremony",
    type: "photo",
    thumbnail:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
    description:
      "Annual ceremony to honor and recognize outstanding contributions of CREA members to railway engineering.",
    date: "December 2023",
    order: 4,
  },
  {
    title: "High-Speed Rail Discussion Panel",
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=400",
    description:
      "Expert panel discussion on implementation and challenges of high-speed rail systems in India.",
    date: "November 2023",
    order: 5,
  },
  {
    title: "Engineers Day Celebration 2024",
    type: "photo",
    thumbnail:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400",
    description:
      "Grand celebration of Engineers Day with cultural programs, technical exhibitions, and networking events.",
    date: "September 2023",
    order: 6,
  },
];

async function seedPastEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing past events
    await PastEvent.deleteMany({});
    console.log("🗑️  Cleared existing past events");

    // Create past events
    const events = await PastEvent.insertMany(defaultPastEvents);
    console.log(`✅ Created ${events.length} past events:`);
    events.forEach((event) => {
      console.log(`   - ${event.title} (${event.type})`);
    });

    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedPastEvents();
