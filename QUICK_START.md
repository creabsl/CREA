# 🚀 Quick Start Guide - Payment System

## ⚡ 5-Minute Setup

### 1. Verify Backend Configuration ✓
```bash
# Check .env file has:
RAZORPAY_KEY_ID=rzp_test_RshcuJVMHpGkj6       ✓
RAZORPAY_KEY_SECRET=fR993aX1bDjo2HCWhOF3Cd5I ✓
EMAIL_USER=gauravghatol4@gmail.com             ✓
EMAIL_PASSWORD=drldtjkbdexowawx                ✓
```

### 2. Start Backend
```powershell
cd E:\CREA\backend
npm run dev
```
**Expected:** Server running on `http://localhost:5001`

### 3. Start Frontend
```powershell
cd E:\CREA\Frontend
npm run dev
```
**Expected:** Application on `http://localhost:5173` or `5174`

---

## 🎯 Test Donation Payment (2 Minutes)

1. Open browser → Donations page
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Mobile: "9876543210"
   - Amount: "500"
3. Click "Donate Now"
4. Razorpay modal opens
5. Click "UPI" tab
6. Enter: `success@razorpay`
7. Click "Pay ₹500"
8. Approve payment
9. ✅ Success message appears
10. 📧 Check email for receipt

---

## 🎯 Test Membership Payment (3 Minutes)

1. Go to Membership page
2. Click "Ordinary Membership" (₹500)
3. Fill form across all 4 steps:
   - Basic Info: Name, designation, division
   - Department, place, unit
   - Mobile, email
4. Step 4: Click "Submit"
5. Razorpay modal opens
6. Click "UPI" tab
7. Enter: `success@razorpay`
8. Click "Pay"
9. ✅ Success - Membership auto-activated
10. 📧 Receipt sent to email

---

## 💳 Payment Test Cards

### UPI (Primary)
```
success@razorpay
9999999999@paytm
Your UPI ID@provider
```

### Cards (If Testing)
```
Card: 4111111111111111
Expiry: Any future date
CVV: Any 3 digits
```

---

## 📊 Verify Payment in Database

### Check Donation Payment
```javascript
// In MongoDB
db.donations.find({ paymentStatus: "completed" })
// Should show payment method: "upi"
```

### Check Membership Payment
```javascript
// In MongoDB
db.memberships.find({ status: "active" })
// Should show paymentMethod: "upi" and status: "active"
```

---

## 📧 Receipt Email

### What User Receives
- From: CREA <support@crea.org>
- Subject: "Donation Receipt" or "Membership Receipt"
- Includes:
  - Receipt PDF attached
  - Payment details
  - Amount & date
  - Payment method (UPI)
  - UPI ID used (if UPI)

---

## ❌ Common Issues & Fixes

### Issue: Razorpay Modal Not Opening
**Check:**
- Credentials in `.env` ✓
- Backend running ✓
- API calls working (check console)

**Fix:**
```bash
# Verify backend
curl http://localhost:5001/api/donations/create-order
# Should return order details
```

### Issue: Payment Verified But Not Updating
**Check:**
- Backend receiving callback ✓
- Signature verification passing ✓
- Database connected ✓

**Fix:**
```bash
# Check backend logs for errors
# Verify RAZORPAY_KEY_SECRET matches
```

### Issue: Email Not Sending
**Check:**
- EMAIL_USER set ✓
- EMAIL_PASSWORD set ✓
- Gmail allow less secure apps ✓

**Fix:**
- Use app-specific password (Gmail)
- Disable 2FA temporarily for testing

### Issue: UPI Tab Not Visible
**Check:**
- `method: { upi: true }` in modal ✓
- Razorpay credentials valid ✓
- Order created successfully ✓

---

## 🔍 Debugging Checklist

- [ ] Backend console shows no errors
- [ ] Frontend console shows no errors
- [ ] `.env` has all credentials
- [ ] Database connection working
- [ ] Email service accessible
- [ ] Razorpay order created in response
- [ ] Modal loads Razorpay script
- [ ] UPI tab visible in modal
- [ ] Payment verification endpoint called
- [ ] Success/error message displays

---

## 🎯 Payment Status Tracking

### Donation Payment States
```
Pending      → Order created, awaiting payment
Completed    → Signature verified, payment recorded
Failed       → Payment rejected or cancelled
```

### Membership Payment States
```
Pending      → Membership form submitted, awaiting payment
Active       → Payment verified, membership activated
Expired      → Membership validity ended
Rejected     → Payment failed
```

---

## 📱 All Payment Methods Available

| Method | User Experience | Speed | Best For |
|--------|-----------------|-------|----------|
| **UPI** | App approval | Instant | Mobile users |
| **Card** | Web form | 1-2 sec | Desktop users |
| **Netbanking** | Bank login | 5-10 sec | Preferred by some |
| **Wallet** | Stored balance | Instant | Paytm users |

---

## 🔐 Security Verification

### What's Secure ✓
- HMAC SHA256 signature verification
- Server-side payment method detection
- No frontend payment confirmation
- Automatic receipt generation
- Payment tracking in database

### Test Security
```bash
# Attempt payment with wrong signature
# Should be rejected immediately
# Database should NOT be updated
```

---

## 📞 Quick Reference

### Server Ports
- Backend: `5001`
- Frontend: `5173` or `5174`

### Key Files
- Config: `.env`
- Donations: `Donations.tsx`, `donationController.js`
- Memberships: `Membership.tsx`, `membershipController.js`
- API: `api.ts`

### Documentation
- Technical: `RAZORPAY_IMPLEMENTATION.md`
- UPI Details: `UPI_PAYMENT_GUIDE.md`
- Membership: `MEMBERSHIP_PAYMENT_COMPLETE.md`
- Complete: `PAYMENT_SYSTEM_COMPLETE.md`

---

## ✅ Success Checklist

- [ ] Backend running
- [ ] Frontend running
- [ ] Donation payment tested
- [ ] Membership payment tested
- [ ] UPI payment verified
- [ ] Receipt received by email
- [ ] Database updated correctly
- [ ] No errors in console
- [ ] Production credentials ready (for live)

---

## 🎉 You're Ready!

Your payment system is **fully functional** with:
- ✅ Donations with Razorpay + UPI
- ✅ Memberships with Razorpay + UPI
- ✅ Automatic receipts
- ✅ Email delivery
- ✅ Database tracking
- ✅ Security verification

**Ready to test or go live!** 🚀
