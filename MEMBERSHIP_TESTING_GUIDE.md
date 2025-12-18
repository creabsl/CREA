# Membership Automation - Testing Guide

## 🧪 Complete Testing Workflow

### Prerequisites

1. ✅ Backend server running (`npm start` in backend folder)
2. ✅ Frontend running (`npm run dev` in Frontend folder)
3. ✅ MongoDB connected
4. ✅ Razorpay test credentials configured
5. ✅ Email credentials configured

---

## Test Scenario 1: New Ordinary Membership

### Step 1: Submit Membership Form

1. Navigate to membership page
2. Fill in all required details:
   - Name, Email, Mobile
   - Designation, Division, Department
   - Place, Unit
   - Select **Ordinary Membership**
   - Amount: ₹1000
3. Click "Proceed to Payment"

**Expected Result:**

```json
{
  "orderId": "order_abc123",
  "keyId": "rzp_test_...",
  "membershipId": "CREA20250001",
  "amount": 1000
}
```

### Step 2: Complete Razorpay Payment

1. Razorpay checkout opens
2. Use test card:
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: Any future date
3. Complete payment

**Expected Result:**

- Payment success callback triggered
- `verify-payment` endpoint called automatically

### Step 3: Verify Automation

Check the following happened **automatically**:

#### A. Member ID Generated

```javascript
// Generated Format: ORD-2025-0001
memberId: "ORD-2025-0001";
```

#### B. User Account Created/Updated

Check in MongoDB `users` collection:

```javascript
{
  _id: ObjectId("..."),
  name: "Test User",
  email: "test@example.com",
  memberId: "ORD-2025-0001",        // ✅ Auto-generated
  membershipType: "Ordinary",       // ✅ Auto-set
  isMember: true,                   // ✅ Activated
  designation: "...",
  division: "...",
  department: "...",
  mobile: "..."
}
```

#### C. Membership Record Updated

Check in MongoDB `memberships` collection:

```javascript
{
  _id: ObjectId("..."),
  membershipId: "CREA20250001",
  status: "active",                 // ✅ Auto-activated
  paymentStatus: "completed",       // ✅ Confirmed
  razorpayPaymentId: "pay_...",
  paymentDate: ISODate("2025-12-18..."),
  type: "ordinary",
  email: "test@example.com"
}
```

#### D. Email Sent

Check email inbox for:

- ✅ Subject: "🎉 Welcome to CREA! Your Member ID: ORD-2025-0001"
- ✅ Member ID displayed prominently
- ✅ PDF receipt attached
- ✅ All membership details included

#### E. Console Logs

Backend console should show:

```
✅ Updated existing user test@example.com with Member ID: ORD-2025-0001
✅ Receipt and welcome email sent to test@example.com
✅ Membership email sent to test@example.com with Member ID: ORD-2025-0001
```

---

## Test Scenario 2: Upgrade to Lifetime Membership

### Prerequisites

- User must have completed Test Scenario 1 (active Ordinary membership)

### Step 1: Initiate Upgrade

1. User logs in with **same email** from Scenario 1
2. Navigates to membership upgrade page
3. Clicks "Upgrade to Lifetime"
4. Amount: ₹5000

**Backend Request:**

```http
POST /api/memberships/upgrade
Content-Type: application/json

{
  "email": "test@example.com",
  "paymentAmount": 5000
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Upgrade order created successfully",
  "orderId": "order_upgrade_123",
  "membershipId": "CREA20250002",
  "isUpgrade": true,
  "currentMemberId": "ORD-2025-0001"
}
```

### Step 2: Complete Payment

1. Razorpay checkout opens
2. Complete payment (same process as before)

### Step 3: Verify Upgrade Automation

Check the following happened **automatically**:

#### A. New Member ID Generated

```javascript
// New Format: LIF-2025-0001 (Lifetime)
memberId: "LIF-2025-0001";
```

#### B. User Account Updated (NOT created new)

Check in MongoDB `users` collection:

```javascript
{
  _id: ObjectId("..."),              // ✅ SAME user ID
  email: "test@example.com",         // ✅ SAME email
  memberId: "LIF-2025-0001",         // ✅ UPDATED to Lifetime ID
  membershipType: "Lifetime",        // ✅ CHANGED from Ordinary
  isMember: true,
  // All other fields preserved
}
```

#### C. New Lifetime Membership Created

Check in MongoDB `memberships` collection:

```javascript
// NEW Lifetime membership record
{
  _id: ObjectId("...new..."),
  membershipId: "CREA20250002",
  type: "lifetime",                  // ✅ Upgraded
  status: "active",
  paymentStatus: "completed",
  email: "test@example.com",         // ✅ Same email
  validUntil: ISODate("2099-12-31")  // ✅ Lifetime
}

// OLD Ordinary membership remains for history
{
  _id: ObjectId("...old..."),
  type: "ordinary",
  status: "active",  // Still active for record keeping
}
```

#### D. Upgrade Email Sent

Check email inbox for:

- ✅ Subject: "🎉 Welcome to CREA! Your Member ID: LIF-2025-0001"
- ✅ **NEW** Lifetime Member ID
- ✅ Updated PDF receipt
- ✅ Confirmation of upgrade

#### E. Console Logs

```
🔄 User test@example.com is upgrading from Ordinary to Lifetime membership
✅ Updated existing user test@example.com with Member ID: LIF-2025-0001
✅ Receipt and welcome email sent to test@example.com
```

---

## Test Scenario 3: Concurrent Signups

### Test Multiple Users at Same Time

1. Open 3 browser windows
2. Have 3 different users signup simultaneously
3. All complete payments at the same time

**Expected Result:**

- ✅ User 1: ORD-2025-0001
- ✅ User 2: ORD-2025-0002
- ✅ User 3: ORD-2025-0003
- ✅ No duplicate IDs
- ✅ All emails sent
- ✅ All accounts created

---

## Test Scenario 4: Edge Cases

### A. User Already Has Lifetime

Try to upgrade a Lifetime member:

```json
{
  "success": false,
  "message": "User already has lifetime membership"
}
```

### B. User Has No Membership

Try to upgrade a user without ordinary membership:

```json
{
  "success": false,
  "message": "User must have ordinary membership to upgrade"
}
```

### C. Payment Failure

1. Use declined test card: 4000 0000 0000 0002
2. Payment fails
3. Membership remains "pending"
4. No Member ID generated
5. No email sent

### D. Email Delivery Failure

1. Backend logs show email error
2. Payment still succeeds (non-blocking)
3. Member ID still generated
4. User account still created
5. Membership still activated

---

## Verification Checklist

### ✅ New Membership

- [ ] Member ID format correct (ORD-YYYY-XXXX)
- [ ] User account created in database
- [ ] `isMember` flag set to true
- [ ] `membershipType` set correctly
- [ ] Email received within 1 minute
- [ ] PDF receipt attached and valid
- [ ] User can login with email
- [ ] Member details visible in admin panel

### ✅ Upgrade

- [ ] New Member ID format correct (LIF-YYYY-XXXX)
- [ ] User account updated (not duplicated)
- [ ] Old Member ID replaced with new one
- [ ] `membershipType` changed to "Lifetime"
- [ ] Upgrade email received
- [ ] New PDF receipt reflects Lifetime
- [ ] User sees updated membership in profile
- [ ] Both memberships visible in admin panel

### ✅ System Health

- [ ] No duplicate Member IDs in database
- [ ] Sequential numbering working
- [ ] All emails delivered successfully
- [ ] No errors in backend console
- [ ] Razorpay payments recorded correctly
- [ ] PDF receipts generated successfully

---

## Debugging Tips

### Member ID Not Generated?

```bash
# Check console logs
cd backend
npm start

# Look for this line after payment:
# "✅ Updated existing user {email} with Member ID: {memberId}"
```

### Email Not Received?

```bash
# Check email configuration
echo $EMAIL_USER
echo $EMAIL_PASSWORD

# Test email manually
node scripts/testEmail.js
```

### Upgrade Not Working?

```javascript
// Check user's current membership
db.users.findOne({ email: "test@example.com" });

// Should show:
// membershipType: "Ordinary"  (before upgrade)
// membershipType: "Lifetime"  (after upgrade)
```

### Database Query Examples

```javascript
// Find all members with IDs
db.users.find({ memberId: { $exists: true } });

// Count ordinary vs lifetime
db.users.aggregate([
  { $group: { _id: "$membershipType", count: { $sum: 1 } } },
]);

// Find latest member ID
db.users
  .find({ memberId: /^ORD-2025/ })
  .sort({ memberId: -1 })
  .limit(1);
```

---

## Success Indicators

When everything is working correctly, you should see:

### 1. Backend Console (during payment verification)

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
💳 Payment verified for membership_xyz123
🆔 Generating Member ID for: test@example.com
✅ Updated existing user test@example.com with Member ID: ORD-2025-0001
📧 Sending welcome email...
✅ Receipt and welcome email sent to test@example.com
✅ Membership email sent to test@example.com with Member ID: ORD-2025-0001
```

### 2. User's Email Inbox

```
Subject: 🎉 Welcome to CREA! Your Member ID: ORD-2025-0001
From: CREA <noreply@crea.org>
Attachments: membership-receipt-[id].pdf (1 file)

[Beautiful HTML email with member ID prominently displayed]
```

### 3. Database State

```javascript
// Users collection
{
  email: "test@example.com",
  memberId: "ORD-2025-0001",
  membershipType: "Ordinary",
  isMember: true
}

// Memberships collection
{
  email: "test@example.com",
  type: "ordinary",
  status: "active",
  paymentStatus: "completed",
  razorpayPaymentId: "pay_abc123"
}
```

---

## 📊 Performance Benchmarks

Expected timing for automated processes:

- **Member ID Generation**: < 100ms
- **User Account Creation/Update**: < 200ms
- **PDF Receipt Generation**: < 500ms
- **Email Delivery**: < 2 seconds
- **Total Automation Time**: < 3 seconds

All operations are **non-blocking** - payment verification responds immediately even if email takes longer.

---

## 🎯 Test Completion Criteria

The system is working correctly when:

1. ✅ Every successful payment generates a unique Member ID
2. ✅ Every new user gets an account automatically
3. ✅ Every payment triggers a welcome email
4. ✅ Upgrades generate new Lifetime IDs
5. ✅ Same email works for both Ordinary and Lifetime
6. ✅ No manual intervention required
7. ✅ All data synced across collections
8. ✅ No duplicate IDs possible
9. ✅ Sequential numbering maintained
10. ✅ System handles 10+ concurrent signups

---

**Ready for Production** ✅

Last Updated: December 18, 2025
