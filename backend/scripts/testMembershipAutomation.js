/**
 * Test Script for Membership Automation
 * Run this after starting the backend server
 */

const axios = require("axios");

const API_BASE = "http://localhost:5001/api";

// Test data
const testUser = {
  name: "Test User",
  email: "test.member@example.com",
  mobile: "9876543210",
  designation: "Test Engineer",
  division: "Mumbai",
  department: "Testing",
  place: "Mumbai",
  unit: "WR",
  type: "ordinary",
  paymentAmount: 1000,
  paymentMethod: "upi",
};

async function testCreateOrder() {
  console.log("\n📋 Testing Create Membership Order...");
  try {
    const response = await axios.post(
      `${API_BASE}/memberships/create-order`,
      testUser
    );
    console.log("✅ Order created successfully:");
    console.log(`   Order ID: ${response.data.orderId}`);
    console.log(`   Membership ID: ${response.data.membershipId}`);
    console.log(`   Amount: ₹${response.data.amount}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return null;
  }
}

async function testUpgrade() {
  console.log("\n🔄 Testing Membership Upgrade...");
  try {
    const response = await axios.post(`${API_BASE}/memberships/upgrade`, {
      email: testUser.email,
      paymentAmount: 5000,
    });
    console.log("✅ Upgrade order created successfully:");
    console.log(`   Order ID: ${response.data.orderId}`);
    console.log(`   Current Member ID: ${response.data.currentMemberId}`);
    console.log(`   Is Upgrade: ${response.data.isUpgrade}`);
    console.log(`   Amount: ₹${response.data.amount}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return null;
  }
}

async function testGetMemberships() {
  console.log("\n📊 Testing Get Memberships (requires admin token)...");
  try {
    // Note: This requires admin authentication
    // You'll need to add the token from localStorage after logging in
    console.log("ℹ️  Skipping (requires admin authentication)");
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting Membership System Tests\n");
  console.log(
    "📌 Make sure the backend server is running on http://localhost:5001\n"
  );
  console.log("=".repeat(60));

  // Test 1: Create Order
  const orderData = await testCreateOrder();

  if (orderData) {
    console.log("\n⚠️  Next Steps:");
    console.log("   1. Use the Order ID to complete payment via Razorpay");
    console.log(
      "   2. After payment, verify-payment endpoint will be called automatically"
    );
    console.log(
      "   3. Check your email for the welcome message with Member ID"
    );
    console.log("   4. Verify user account was created/updated in database");
  }

  // Test 2: Upgrade (will fail if user doesn't exist with ordinary membership)
  console.log("\n" + "=".repeat(60));
  await testUpgrade();

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Tests completed!");
  console.log("\n📝 Manual Testing Required:");
  console.log("   • Complete Razorpay payment flow");
  console.log("   • Verify email delivery");
  console.log("   • Check database updates");
  console.log("   • Test upgrade after ordinary membership active\n");
}

// Run tests
runTests().catch(console.error);
