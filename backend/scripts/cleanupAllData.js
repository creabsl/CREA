/**
 * Cleanup Script - Remove all dummy data while preserving admin account
 *
 * This script will:
 * 1. Delete all users EXCEPT crearail5@gmail.com (admin)
 * 2. Delete all donations
 * 3. Delete all memberships
 * 4. Delete all forum topics and posts
 * 5. Delete all events and event ads
 * 6. Delete all notifications
 * 7. Delete all suggestions
 * 8. Delete all mutual transfers
 * 9. Delete all body members
 * 10. Delete all breaking news
 * 11. Delete all advertisements
 * 12. Delete all achievements
 * 13. Delete all circulars
 * 14. Delete all court cases
 * 15. Delete all manuals
 * 16. Delete all external links
 * 17. Delete all OTPs
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Donation = require("../models/donationModel");
const Membership = require("../models/membershipModel");
const { ForumTopic, ForumPost } = require("../models/forumModels");
const Event = require("../models/eventModel");
const EventAd = require("../models/eventAdModel");
const Notification = require("../models/notificationModel");
const Suggestion = require("../models/suggestionModel");
const MutualTransfer = require("../models/mutualTransferModel");
const BodyMember = require("../models/bodyMemberModel");
const BreakingNews = require("../models/breakingNewsModel");
const Advertisement = require("../models/advertisementModel");
const Achievement = require("../models/achievementModel");
const Circular = require("../models/circularModel");
const CourtCase = require("../models/courtCaseModel");
const Manual = require("../models/manualModel");
const ExternalLink = require("../models/externalLinkModel");
const Otp = require("../models/otpModel");

const ADMIN_EMAIL = "crearail5@gmail.com";

async function cleanupAllData() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    let totalDeleted = 0;

    // 1. Delete all users except admin
    console.log("👥 Cleaning up Users...");
    const adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
      console.log("⚠️  WARNING: Admin user not found! Creating admin user...");
      // You should manually create the admin if this happens
      console.log(
        "❌ Please create admin user first before running this script!"
      );
      process.exit(1);
    }
    const deletedUsers = await User.deleteMany({ email: { $ne: ADMIN_EMAIL } });
    console.log(
      `   Deleted ${deletedUsers.deletedCount} users (preserved admin: ${ADMIN_EMAIL})`
    );
    totalDeleted += deletedUsers.deletedCount;

    // 2. Delete all donations
    console.log("💰 Cleaning up Donations...");
    const deletedDonations = await Donation.deleteMany({});
    console.log(`   Deleted ${deletedDonations.deletedCount} donations`);
    totalDeleted += deletedDonations.deletedCount;

    // 3. Delete all memberships
    console.log("🎫 Cleaning up Memberships...");
    const deletedMemberships = await Membership.deleteMany({});
    console.log(`   Deleted ${deletedMemberships.deletedCount} memberships`);
    totalDeleted += deletedMemberships.deletedCount;

    // 4. Delete all forum posts and topics
    console.log("💬 Cleaning up Forum Posts...");
    const deletedPosts = await ForumPost.deleteMany({});
    console.log(`   Deleted ${deletedPosts.deletedCount} forum posts`);
    totalDeleted += deletedPosts.deletedCount;

    console.log("📋 Cleaning up Forum Topics...");
    const deletedTopics = await ForumTopic.deleteMany({});
    console.log(`   Deleted ${deletedTopics.deletedCount} forum topics`);
    totalDeleted += deletedTopics.deletedCount;

    // 5. Delete all events
    console.log("📅 Cleaning up Events...");
    const deletedEvents = await Event.deleteMany({});
    console.log(`   Deleted ${deletedEvents.deletedCount} events`);
    totalDeleted += deletedEvents.deletedCount;

    // 6. Delete all event ads
    console.log("📢 Cleaning up Event Ads...");
    const deletedEventAds = await EventAd.deleteMany({});
    console.log(`   Deleted ${deletedEventAds.deletedCount} event ads`);
    totalDeleted += deletedEventAds.deletedCount;

    // 7. Delete all notifications
    console.log("🔔 Cleaning up Notifications...");
    const deletedNotifications = await Notification.deleteMany({});
    console.log(
      `   Deleted ${deletedNotifications.deletedCount} notifications`
    );
    totalDeleted += deletedNotifications.deletedCount;

    // 8. Delete all suggestions
    console.log("💡 Cleaning up Suggestions...");
    const deletedSuggestions = await Suggestion.deleteMany({});
    console.log(`   Deleted ${deletedSuggestions.deletedCount} suggestions`);
    totalDeleted += deletedSuggestions.deletedCount;

    // 9. Delete all mutual transfers
    console.log("🔄 Cleaning up Mutual Transfers...");
    const deletedTransfers = await MutualTransfer.deleteMany({});
    console.log(`   Deleted ${deletedTransfers.deletedCount} mutual transfers`);
    totalDeleted += deletedTransfers.deletedCount;

    // 10. Delete all body members
    console.log("👔 Cleaning up Body Members...");
    const deletedBodyMembers = await BodyMember.deleteMany({});
    console.log(`   Deleted ${deletedBodyMembers.deletedCount} body members`);
    totalDeleted += deletedBodyMembers.deletedCount;

    // 11. Delete all breaking news
    console.log("📰 Cleaning up Breaking News...");
    const deletedBreakingNews = await BreakingNews.deleteMany({});
    console.log(
      `   Deleted ${deletedBreakingNews.deletedCount} breaking news items`
    );
    totalDeleted += deletedBreakingNews.deletedCount;

    // 12. Delete all advertisements
    console.log("📣 Cleaning up Advertisements...");
    const deletedAdvertisements = await Advertisement.deleteMany({});
    console.log(
      `   Deleted ${deletedAdvertisements.deletedCount} advertisements`
    );
    totalDeleted += deletedAdvertisements.deletedCount;

    // 13. Delete all achievements
    console.log("🏆 Cleaning up Achievements...");
    const deletedAchievements = await Achievement.deleteMany({});
    console.log(`   Deleted ${deletedAchievements.deletedCount} achievements`);
    totalDeleted += deletedAchievements.deletedCount;

    // 14. Delete all circulars
    console.log("📜 Cleaning up Circulars...");
    const deletedCirculars = await Circular.deleteMany({});
    console.log(`   Deleted ${deletedCirculars.deletedCount} circulars`);
    totalDeleted += deletedCirculars.deletedCount;

    // 15. Delete all court cases
    console.log("⚖️  Cleaning up Court Cases...");
    const deletedCourtCases = await CourtCase.deleteMany({});
    console.log(`   Deleted ${deletedCourtCases.deletedCount} court cases`);
    totalDeleted += deletedCourtCases.deletedCount;

    // 16. Delete all manuals
    console.log("📚 Cleaning up Manuals...");
    const deletedManuals = await Manual.deleteMany({});
    console.log(`   Deleted ${deletedManuals.deletedCount} manuals`);
    totalDeleted += deletedManuals.deletedCount;

    // 17. Delete all external links
    console.log("🔗 Cleaning up External Links...");
    const deletedExternalLinks = await ExternalLink.deleteMany({});
    console.log(
      `   Deleted ${deletedExternalLinks.deletedCount} external links`
    );
    totalDeleted += deletedExternalLinks.deletedCount;

    // 18. Delete all OTPs
    console.log("🔐 Cleaning up OTPs...");
    const deletedOtps = await Otp.deleteMany({});
    console.log(`   Deleted ${deletedOtps.deletedCount} OTPs`);
    totalDeleted += deletedOtps.deletedCount;

    console.log("\n" + "=".repeat(50));
    console.log("✅ CLEANUP COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`📊 Total records deleted: ${totalDeleted}`);
    console.log(`✅ Admin account preserved: ${ADMIN_EMAIL}`);
    console.log("=".repeat(50) + "\n");

    // Verify admin still exists
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    if (adminExists) {
      console.log(
        `✅ Verified: Admin user "${adminExists.name}" (${adminExists.email}) still exists`
      );
      console.log(`   Role: ${adminExists.role}`);
      console.log(`   Created: ${adminExists.createdAt}`);
    } else {
      console.log("❌ ERROR: Admin user was deleted! This should not happen!");
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the cleanup
console.log("⚠️  WARNING: This will delete ALL data except the admin user!");
console.log(`⚠️  Admin email to preserve: ${ADMIN_EMAIL}`);
console.log("⚠️  Press Ctrl+C within 5 seconds to cancel...\n");

setTimeout(() => {
  cleanupAllData()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}, 5000);
