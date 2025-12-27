require("dotenv").config();
const mongoose = require("mongoose");
const AboutMilestone = require("../models/aboutMilestoneModel");
const User = require("../models/userModel");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://railway:railway@cluster0.bvyozxr.mongodb.net/crea?retryWrites=true&w=majority";

// Default milestones based on the frontend defaults
const defaultMilestones = [
  {
    year: "1950",
    title: "Formation of CREA",
    description:
      "The Central Railway Engineers Association was established to unite engineering professionals and advocate for their rights and welfare.",
    icon: "🚂",
    order: 1,
  },
  {
    year: "1975",
    title: "Major Expansion & First All-India Convention",
    description:
      "CREA expanded its reach across all divisions, hosting the first All-India Convention bringing together engineers nationwide.",
    icon: "🎯",
    order: 2,
  },
  {
    year: "2000",
    title: "Digitalization Initiative & Online Resource Launch",
    description:
      "Embracing technology, CREA launched its digital platform providing online resources and communication tools for members.",
    icon: "💻",
    order: 3,
  },
  {
    year: "2020",
    title: "Centenary Celebrations & New Welfare Programs",
    description:
      "Marking decades of service, CREA introduced enhanced welfare programs and expanded member benefits significantly.",
    icon: "🎊",
    order: 4,
  },
];

async function seedAboutMilestones() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find an admin user to set as creator
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log(
        "⚠️  No admin user found. Creating milestones without creator."
      );
    }

    console.log("🗑️  Clearing existing milestones...");
    await AboutMilestone.deleteMany({});

    console.log("🌱 Seeding about milestones...");
    const milestonesWithCreator = defaultMilestones.map((m) => ({
      ...m,
      createdBy: adminUser?._id,
      isActive: true,
    }));

    const created = await AboutMilestone.insertMany(milestonesWithCreator);
    console.log(`✅ Created ${created.length} milestones:`);
    created.forEach((m) => {
      console.log(`   - ${m.year}: ${m.title}`);
    });

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding milestones:", error);
    process.exit(1);
  }
}

seedAboutMilestones();
