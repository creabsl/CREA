const Membership = require("../models/membershipModel");
const User = require("../models/userModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

// Initialize Razorpay instance
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

/**
 * Generate PDF Receipt for Membership
 */
const generateMembershipReceipt = async (membership, razorpayPaymentId) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const receiptsDir = path.join(__dirname, "../uploads/receipts");

      // Create receipts directory if it doesn't exist
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }

      const fileName = `membership-receipt-${membership._id}.pdf`;
      const filePath = path.join(receiptsDir, fileName);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("MEMBERSHIP RECEIPT", 100, 50);
      doc.moveTo(50, 80).lineTo(550, 80).stroke();

      // Receipt Details
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Receipt No: ${membership._id}`, 50, 100);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 120);
      doc.text(`Payment ID: ${razorpayPaymentId}`, 50, 140);
      doc.text(
        `Membership ID: ${
          membership.membershipId || "Generated upon activation"
        }`,
        50,
        160
      );

      // Member Information
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Member Information", 50, 195);
      doc.fontSize(11).font("Helvetica");
      doc.text(`Name: ${membership.name}`, 50, 215);
      doc.text(`Email: ${membership.email}`, 50, 235);
      doc.text(`Mobile: ${membership.mobile}`, 50, 255);

      // Professional Details
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Professional Details", 50, 295);
      doc.fontSize(11).font("Helvetica");
      doc.text(`Designation: ${membership.designation}`, 50, 315);
      doc.text(`Division: ${membership.division}`, 50, 335);
      doc.text(`Department: ${membership.department}`, 50, 355);

      // Membership Details
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Membership Details", 50, 395);
      doc.fontSize(11).font("Helvetica");
      doc.text(
        `Type: ${
          membership.type.charAt(0).toUpperCase() + membership.type.slice(1)
        }`,
        50,
        415
      );
      doc.text(`Amount: ₹${membership.paymentAmount}`, 50, 435);
      doc.text(`Status: ${membership.status.toUpperCase()}`, 50, 455);
      doc.text(
        `Valid From: ${new Date(membership.validFrom).toLocaleDateString()}`,
        50,
        475
      );
      doc.text(
        `Valid Until: ${new Date(membership.validUntil).toLocaleDateString()}`,
        50,
        495
      );

      // Payment Information
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Payment Information", 50, 535);
      doc.fontSize(11).font("Helvetica");
      doc.text(`Payment Gateway: Razorpay`, 50, 555);
      doc.text(`Status: ${membership.paymentStatus.toUpperCase()}`, 50, 575);
      doc.text(
        `Payment Date: ${new Date(membership.paymentDate).toLocaleString()}`,
        50,
        595
      );

      // Footer
      doc.moveTo(50, 630).lineTo(550, 630).stroke();
      doc
        .fontSize(10)
        .text(
          "This is an officially generated receipt powered by Razorpay.",
          50,
          640,
          { align: "center" }
        );
      doc.text("Welcome to CREA!", 50, 655, { align: "center" });

      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate unique member ID based on type
 * Format: ORD-YYYY-XXXX for Ordinary, LIF-YYYY-XXXX for Lifetime
 */
const generateMemberId = async (membershipType) => {
  try {
    const currentYear = new Date().getFullYear();
    const prefix = membershipType === "ordinary" ? "ORD" : "LIF";

    // Count existing members of this type to generate sequential number
    const count = await User.countDocuments({
      memberId: { $regex: `^${prefix}-${currentYear}` },
    });

    const sequentialNumber = (count + 1).toString().padStart(4, "0");
    const memberId = `${prefix}-${currentYear}-${sequentialNumber}`;

    // Check if this ID already exists (collision prevention)
    const existingUser = await User.findOne({ memberId });
    if (existingUser) {
      // If collision, recursively try next number
      return generateMemberId(membershipType);
    }

    return memberId;
  } catch (error) {
    console.error("Error generating member ID:", error);
    throw error;
  }
};

/**
 * Send Membership Receipt Email with Member ID
 */
const sendMembershipReceiptEmail = async (
  membership,
  receiptPath,
  razorpay_payment_id,
  memberId
) => {
  try {
    const membershipTypeLabel =
      membership.type === "ordinary"
        ? "Ordinary Membership"
        : "Lifetime Membership";
    const memberIdPrefix = membership.type === "ordinary" ? "ORD" : "LIF";

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@crea.org",
      to: membership.email,
      subject: `🎉 Welcome to CREA! Your Member ID: ${memberId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #1e5a8e 0%, #2874b8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to CREA!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your membership is now active</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear <strong>${
              membership.name
            }</strong>,</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">Congratulations! Your ${membershipTypeLabel} application has been approved and payment of <strong style="color: #1e5a8e;">₹${
        membership.paymentAmount
      }</strong> has been received successfully.</p>
            
            <div style="background: #f0f8ff; border-left: 4px solid #1e5a8e; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin: 0 0 15px 0; color: #1e5a8e; font-size: 18px;">📋 Your Membership Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Member ID:</td>
                  <td style="padding: 8px 0; color: #1e5a8e; font-weight: bold; font-size: 18px;">${memberId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Membership Type:</td>
                  <td style="padding: 8px 0; color: #333;">${membershipTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Payment ID:</td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace;">${razorpayPaymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #333;">₹${
                    membership.paymentAmount
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Valid From:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(
                    membership.validFrom
                  ).toLocaleDateString("en-IN")}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Valid Until:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    membership.type === "lifetime"
                      ? "Lifetime"
                      : new Date(membership.validUntil).toLocaleDateString(
                          "en-IN"
                        )
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Status:</td>
                  <td style="padding: 8px 0;"><span style="background: #4caf50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">ACTIVE</span></td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #856404;">
                <strong>📎 Note:</strong> Your official membership receipt is attached to this email. Please keep it for your records.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 25px;">
              You can now access all member-exclusive features on the CREA portal. Use your registered email <strong>${
                membership.email
              }</strong> to log in.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">Thank you for joining CREA!</p>
              <p style="color: #1e5a8e; font-weight: bold; font-size: 14px; margin: 10px 0 0 0;">CREA Team</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `membership-receipt-${membership._id}.pdf`,
          path: receiptPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `✅ Membership email sent to ${membership.email} with Member ID: ${memberId}`
    );
  } catch (error) {
    console.error("❌ Error sending membership receipt email:", error);
    throw error; // Re-throw to handle in calling function
  }
};

/**
 * Create Razorpay Order for Membership
 * Step 1: Validate membership form data
 * Step 2: Create membership record with status 'pending'
 * Step 3: Generate Razorpay Order
 */
exports.createOrder = async (req, res) => {
  try {
    const payload = req.body || {};

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "mobile",
      "designation",
      "division",
      "department",
      "type",
      "paymentAmount",
    ];
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check for existing membership
    const existingMembership = await Membership.findOne({
      email: payload.email,
    });

    let membership;
    let isUpgrading = false;

    if (existingMembership) {
      // Check if this is an upgrade from ordinary to lifetime
      const isUpgrade =
        existingMembership.type === "ordinary" &&
        payload.type === "lifetime" &&
        existingMembership.status === "active";

      if (isUpgrade) {
        // This is an upgrade - update existing membership for new payment
        console.log(
          `🔄 User ${payload.email} is upgrading from ordinary to lifetime`
        );
        isUpgrading = true;

        // Update existing membership for upgrade payment
        existingMembership.type = "lifetime";
        existingMembership.paymentStatus = "pending";
        existingMembership.status = "pending";
        existingMembership.paymentAmount = payload.paymentAmount;
        existingMembership.paymentMethod = payload.paymentMethod || "upi";
        existingMembership.razorpayOrderId = null;
        existingMembership.razorpayPaymentId = null;
        existingMembership.razorpaySignature = null;

        // Update other details if provided
        if (payload.designation)
          existingMembership.designation = payload.designation;
        if (payload.division) existingMembership.division = payload.division;
        if (payload.department)
          existingMembership.department = payload.department;
        if (payload.mobile) existingMembership.mobile = payload.mobile;
        if (payload.place) existingMembership.place = payload.place;
        if (payload.unit) existingMembership.unit = payload.unit;

        // Update personal details if provided
        if (payload.personalDetails) {
          existingMembership.personalDetails = {
            ...existingMembership.personalDetails,
            ...payload.personalDetails,
          };
        }

        // Update professional details if provided
        if (payload.professionalDetails) {
          existingMembership.professionalDetails = {
            ...existingMembership.professionalDetails,
            ...payload.professionalDetails,
          };
        }

        membership = existingMembership;
      } else {
        // If not upgrading, check if they already have the same type
        if (existingMembership.type === payload.type) {
          return res.status(400).json({
            success: false,
            message: `Email already registered for ${payload.type} membership`,
          });
        }
        // If they have lifetime and trying to get ordinary
        if (existingMembership.type === "lifetime") {
          return res.status(400).json({
            success: false,
            message: "Email already has lifetime membership (the highest tier)",
          });
        }
      }
    } else {
      // No existing membership - create new one
      membership = new Membership({
        ...payload,
        user: req.user?._id,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: payload.paymentMethod || "upi",
        upiId: payload.upiId || null,
      });
    }

    // Set validity period for new or upgraded membership
    membership.setValidity();

    // Save membership
    await membership.save();

    // Create Razorpay Order (amount in paise)
    const options = {
      amount: Math.round(payload.paymentAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `membership_${membership._id.toString()}`,
      notes: {
        membershipId: membership._id.toString(),
        type: payload.type,
        email: payload.email,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save Razorpay order ID to membership
    membership.razorpayOrderId = order.id;
    await membership.save();

    res.status(201).json({
      success: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      membershipDbId: membership._id,
      membershipId: membership.membershipId,
      amount: payload.paymentAmount,
    });
  } catch (err) {
    console.error("Create membership order error:", err.message || err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered for membership",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};

/**
 * Verify Razorpay Payment Signature for Membership
 * Step 3: Verify signature using HMAC SHA256
 * Step 4: Update membership status to 'active'
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Generate expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Verify signature matches
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Find and update membership
    const membership = await Membership.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership record not found",
      });
    }

    // Fetch payment details from Razorpay to get payment method
    let paymentMethod = "card";
    let upiId = null;
    try {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      paymentMethod = paymentDetails.method || "card"; // upi, card, netbanking, wallet
      if (paymentDetails.vpa) {
        upiId = paymentDetails.vpa; // VPA for UPI payments
      }
    } catch (fetchError) {
      console.error("Error fetching payment details:", fetchError);
      // Continue with default payment method
    }

    // Update membership with payment details
    membership.razorpayPaymentId = razorpay_payment_id;
    membership.razorpaySignature = razorpay_signature;
    membership.paymentStatus = "completed";
    membership.paymentDate = new Date();
    membership.paymentReference = razorpay_payment_id;
    membership.paymentMethod = paymentMethod;
    membership.upiId = upiId;
    membership.status = "active"; // Automatically activate after successful payment

    await membership.save();

    // Generate unique member ID
    let memberId = null;
    let user = null;

    try {
      // Find or create user account
      user = await User.findOne({ email: membership.email });

      if (user) {
        // Check if user is upgrading from Ordinary to Lifetime
        const isUpgrade =
          user.membershipType === "Ordinary" && membership.type === "lifetime";

        if (isUpgrade) {
          console.log(
            `🔄 User ${user.email} is upgrading from Ordinary to Lifetime membership`
          );
          // Generate new Lifetime member ID
          memberId = await generateMemberId("lifetime");
        } else if (!user.memberId) {
          // User exists but doesn't have member ID yet (first membership)
          memberId = await generateMemberId(membership.type);
        } else {
          // User already has member ID, keep existing one
          memberId = user.memberId;
        }

        // Update user's membership details
        user.memberId = memberId;
        user.membershipType =
          membership.type === "ordinary" ? "Ordinary" : "Lifetime";
        user.isMember = true;
        user.designation = membership.designation || user.designation;
        user.division = membership.division || user.division;
        user.department = membership.department || user.department;
        user.mobile = membership.mobile || user.mobile;
        user.name = membership.name || user.name;
        user.dateOfBirth =
          membership.personalDetails?.dateOfBirth || user.dateOfBirth;

        await user.save();
        console.log(
          `✅ Updated existing user ${user.email} with Member ID: ${memberId}, Type: ${user.membershipType}`
        );
      } else {
        // Create new user account (user doesn't exist)
        memberId = await generateMemberId(membership.type);

        // Generate a temporary password (user can reset via forgot password)
        const tempPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8).toUpperCase();

        user = new User({
          name: membership.name,
          email: membership.email,
          password: tempPassword,
          designation: membership.designation,
          division: membership.division,
          department: membership.department,
          mobile: membership.mobile,
          dateOfBirth: membership.personalDetails?.dateOfBirth,
          memberId: memberId,
          membershipType:
            membership.type === "ordinary" ? "Ordinary" : "Lifetime",
          isMember: true,
          role: "member",
        });

        await user.save();
        console.log(
          `✅ Created new user account for ${user.email} with Member ID: ${memberId}`
        );
      }
    } catch (userError) {
      console.error("❌ Error creating/updating user account:", userError);
      // Don't fail the payment verification, but log the error
    }

    // Generate receipt PDF and send email with member ID
    try {
      const receiptPath = await generateMembershipReceipt(
        membership,
        razorpay_payment_id
      );
      await sendMembershipReceiptEmail(
        membership,
        receiptPath,
        razorpay_payment_id,
        memberId
      );
      console.log(`✅ Receipt and welcome email sent to ${membership.email}`);
    } catch (receiptError) {
      console.error(
        "❌ Receipt generation error (non-blocking):",
        receiptError
      );
      // Continue - don't fail payment verification
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      membershipId: membership._id,
      membershipNumber: membership.membershipId,
      memberId: memberId,
      status: membership.status,
      paymentStatus: membership.paymentStatus,
      receiptSent: true,
      isUpgrade:
        user?.membershipType === "Lifetime" && membership.type === "lifetime",
    });
  } catch (error) {
    console.error("Error verifying membership payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// POST /api/memberships (legacy - for non-payment submissions, if needed)
exports.submitMembership = async (req, res) => {
  try {
    const payload = req.body || {};

    // Validate required fields before attempting to save
    const requiredFields = [
      "name",
      "email",
      "mobile",
      "designation",
      "division",
      "department",
      "type",
    ];
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Create new membership
    const membership = new Membership({
      ...payload,
      user: req.user?._id,
      status: "pending",
      paymentStatus: "pending",
    });

    // Set validity period
    membership.setValidity();

    // Save membership
    await membership.save();

    return res.status(201).json({
      success: true,
      membershipId: membership.membershipId,
      paymentStatus: membership.paymentStatus,
    });
  } catch (err) {
    console.error("Submit membership error:", err.message || err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: "Email already registered for membership",
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + Object.keys(err.errors).join(", "),
      });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/memberships/:id/status
exports.updateMembershipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentReference } = req.body;

    const membership = await Membership.findById(id).populate("userId");
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }

    const previousStatus = membership.status;

    if (status) membership.status = status;
    if (paymentStatus) {
      membership.paymentStatus = paymentStatus;
      if (paymentStatus === "completed") {
        membership.paymentDate = new Date();
        membership.paymentReference = paymentReference;
        membership.status = "active";
      }
    }

    await membership.save();

    // Send notification on status change
    const { createNotification } = require("./notificationController");
    if (membership.userId && previousStatus !== membership.status) {
      let notifMessage = "";
      if (membership.status === "active") {
        notifMessage =
          "Your membership application has been approved and is now active!";
      } else if (membership.status === "rejected") {
        notifMessage =
          "Your membership application has been reviewed. Please contact admin for more details.";
      } else if (membership.status === "pending") {
        notifMessage = "Your membership application is under review.";
      }

      if (notifMessage) {
        await createNotification(
          membership.userId._id || membership.userId,
          "membership",
          "Membership Status Updated",
          notifMessage,
          "/profile",
          { membershipId: membership._id, status: membership.status }
        );
      }
    }

    return res.json({ success: true, membership });
  } catch (err) {
    console.error("Update membership status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/memberships/:id/renew
exports.renewMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReference, amount } = req.body;

    const membership = await Membership.findById(id);
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }

    await membership.renew(paymentReference, amount);
    return res.json({ success: true, membership });
  } catch (err) {
    console.error("Renew membership error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/memberships/stats
exports.getMembershipStats = async (req, res) => {
  try {
    const stats = await Membership.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byDepartment: [
            { $group: { _id: "$department", count: { $sum: 1 } } },
          ],
          byType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);

    return res.json(stats[0]);
  } catch (err) {
    console.error("Get membership stats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/memberships/bulk-upload (admin)
exports.bulkUploadMembers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let members = [];

    // Parse CSV file
    if (fileExtension === ".csv") {
      members = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
      });
    }
    // Parse Excel file (.xlsx, .xls)
    else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      members = XLSX.utils.sheet_to_json(sheet);
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "Invalid file format. Please upload CSV or Excel file.",
      });
    }

    // Validate and process members
    const results = {
      success: [],
      failed: [],
      total: members.length,
    };

    const requiredFields = [
      "name",
      "email",
      "mobile",
      "designation",
      "division",
      "department",
      "type",
    ];

    for (let i = 0; i < members.length; i++) {
      const memberData = members[i];
      const rowNumber = i + 2; // +2 because row 1 is header and array is 0-indexed

      try {
        // Normalize field names (handle different case variations)
        const normalizedData = {};
        Object.keys(memberData).forEach((key) => {
          const normalizedKey = key.trim().toLowerCase();
          normalizedData[normalizedKey] = memberData[key];
        });

        // Map common field variations
        const fieldMapping = {
          name: ["name", "full name", "fullname", "member name"],
          email: ["email", "e-mail", "email address"],
          mobile: [
            "mobile",
            "phone",
            "contact",
            "mobile number",
            "phone number",
          ],
          designation: ["designation", "position", "post"],
          division: ["division", "div"],
          department: ["department", "dept"],
          type: ["type", "membership type", "membershiptype"],
          place: ["place", "location"],
          unit: ["unit"],
          paymentMethod: ["payment method", "paymentmethod", "payment"],
          paymentAmount: ["payment amount", "paymentamount", "amount"],
          purchaseDate: [
            "purchase date",
            "purchasedate",
            "date of purchase",
            "membership date",
            "start date",
            "startdate",
          ],
        };

        const processedData = {};
        Object.keys(fieldMapping).forEach((field) => {
          const variations = fieldMapping[field];
          for (const variation of variations) {
            if (
              normalizedData[variation] !== undefined &&
              normalizedData[variation] !== ""
            ) {
              processedData[field] = normalizedData[variation];
              break;
            }
          }
        });

        // Check required fields
        const missingFields = requiredFields.filter(
          (field) => !processedData[field]
        );
        if (missingFields.length > 0) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Missing required fields: ${missingFields.join(", ")}`,
          });
          continue;
        }

        // Validate membership type
        const membershipType = processedData.type.toLowerCase();
        if (!["ordinary", "lifetime"].includes(membershipType)) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Invalid membership type: ${processedData.type}. Must be 'ordinary' or 'lifetime'`,
          });
          continue;
        }

        // Parse and validate purchase date if provided
        let purchaseDate = new Date(); // Default to current date
        if (processedData.purchaseDate) {
          const parsedDate = new Date(processedData.purchaseDate);
          if (isNaN(parsedDate.getTime())) {
            results.failed.push({
              row: rowNumber,
              data: memberData,
              error: `Invalid purchase date format: ${processedData.purchaseDate}. Use YYYY-MM-DD or MM/DD/YYYY`,
            });
            continue;
          }
          purchaseDate = parsedDate;
        }

        // Calculate validity dates based on purchase date
        const validFrom = new Date(purchaseDate);
        let validUntil;

        if (membershipType === "lifetime") {
          validUntil = new Date(2099, 11, 31); // Far future date for lifetime members
        } else {
          // For ordinary membership, add 1 year to purchase date
          validUntil = new Date(validFrom);
          validUntil.setFullYear(validUntil.getFullYear() + 1);
        }

        // Prepare membership document
        const membershipDoc = {
          name: processedData.name,
          email: processedData.email.toLowerCase().trim(),
          mobile: processedData.mobile,
          designation: processedData.designation,
          division: processedData.division,
          department: processedData.department,
          place: processedData.place || "Not specified",
          unit: processedData.unit || "Not specified",
          type: membershipType,
          paymentMethod: processedData.paymentMethod || "upi",
          paymentAmount:
            processedData.paymentAmount ||
            (membershipType === "lifetime" ? 5000 : 500),
          paymentStatus: "completed",
          status: "active",
          validFrom: validFrom,
          validUntil: validUntil,
          paymentDate: purchaseDate,
        };

        // Check for duplicate email
        const existingMember = await Membership.findOne({
          email: membershipDoc.email,
        });
        if (existingMember) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Email already exists: ${membershipDoc.email}`,
          });
          continue;
        }

        // Create and save membership (validity dates already set above)
        const membership = new Membership(membershipDoc);
        await membership.save();

        results.success.push({
          row: rowNumber,
          membershipId: membership.membershipId,
          name: membership.name,
          email: membership.email,
          validFrom: membership.validFrom,
          validUntil: membership.validUntil,
        });
      } catch (error) {
        results.failed.push({
          row: rowNumber,
          data: memberData,
          error: error.message || "Unknown error",
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: `Processed ${results.total} records. ${results.success.length} successful, ${results.failed.length} failed.`,
      results,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Server error during bulk upload",
      error: err.message,
    });
  }
};

// GET /api/memberships (admin)
exports.listMemberships = async (req, res) => {
  try {
    const { status, department, type } = req.query;
    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;
    if (type) query.type = type;

    const list = await Membership.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    // Add expiry status to each membership
    const membershipsWithStatus = list.map((membership) => ({
      ...membership.toObject(),
      isExpired: membership.isExpired(),
    }));

    return res.json(membershipsWithStatus);
  } catch (err) {
    console.error("List memberships error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/memberships/:id/status
exports.updateMembershipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentReference } = req.body;

    const membership = await Membership.findById(id).populate("userId");
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }

    const previousStatus = membership.status;

    if (status) membership.status = status;
    if (paymentStatus) {
      membership.paymentStatus = paymentStatus;
      if (paymentStatus === "completed") {
        membership.paymentDate = new Date();
        membership.paymentReference = paymentReference;
        membership.status = "active";
      }
    }

    await membership.save();

    // Send notification on status change
    const { createNotification } = require("./notificationController");
    if (membership.userId && previousStatus !== membership.status) {
      let notifMessage = "";
      if (membership.status === "active") {
        notifMessage =
          "Your membership application has been approved and is now active!";
      } else if (membership.status === "rejected") {
        notifMessage =
          "Your membership application has been reviewed. Please contact admin for more details.";
      } else if (membership.status === "pending") {
        notifMessage = "Your membership application is under review.";
      }

      if (notifMessage) {
        await createNotification(
          membership.userId._id || membership.userId,
          "membership",
          "Membership Status Updated",
          notifMessage,
          "/profile",
          { membershipId: membership._id, status: membership.status }
        );
      }
    }

    return res.json({ success: true, membership });
  } catch (err) {
    console.error("Update membership status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/memberships/:id/renew
exports.renewMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReference, amount } = req.body;

    const membership = await Membership.findById(id);
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }

    await membership.renew(paymentReference, amount);
    return res.json({ success: true, membership });
  } catch (err) {
    console.error("Renew membership error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/memberships/stats
exports.getMembershipStats = async (req, res) => {
  try {
    const stats = await Membership.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          byDepartment: [
            { $group: { _id: "$department", count: { $sum: 1 } } },
          ],
          byType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
          total: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);

    return res.json(stats[0]);
  } catch (err) {
    console.error("Get membership stats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/memberships/bulk-upload (admin)
exports.bulkUploadMembers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let members = [];

    // Parse CSV file
    if (fileExtension === ".csv") {
      members = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
      });
    }
    // Parse Excel file (.xlsx, .xls)
    else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      members = XLSX.utils.sheet_to_json(sheet);
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "Invalid file format. Please upload CSV or Excel file.",
      });
    }

    // Validate and process members
    const results = {
      success: [],
      failed: [],
      total: members.length,
    };

    const requiredFields = [
      "name",
      "email",
      "mobile",
      "designation",
      "division",
      "department",
      "type",
    ];

    for (let i = 0; i < members.length; i++) {
      const memberData = members[i];
      const rowNumber = i + 2; // +2 because row 1 is header and array is 0-indexed

      try {
        // Normalize field names (handle different case variations)
        const normalizedData = {};
        Object.keys(memberData).forEach((key) => {
          const normalizedKey = key.trim().toLowerCase();
          normalizedData[normalizedKey] = memberData[key];
        });

        // Map common field variations
        const fieldMapping = {
          name: ["name", "full name", "fullname", "member name"],
          email: ["email", "e-mail", "email address"],
          mobile: [
            "mobile",
            "phone",
            "contact",
            "mobile number",
            "phone number",
          ],
          designation: ["designation", "position", "post"],
          division: ["division", "div"],
          department: ["department", "dept"],
          type: ["type", "membership type", "membershiptype"],
          place: ["place", "location"],
          unit: ["unit"],
          paymentMethod: ["payment method", "paymentmethod", "payment"],
          paymentAmount: ["payment amount", "paymentamount", "amount"],
          purchaseDate: [
            "purchase date",
            "purchasedate",
            "date of purchase",
            "membership date",
            "start date",
            "startdate",
          ],
        };

        const processedData = {};
        Object.keys(fieldMapping).forEach((field) => {
          const variations = fieldMapping[field];
          for (const variation of variations) {
            if (
              normalizedData[variation] !== undefined &&
              normalizedData[variation] !== ""
            ) {
              processedData[field] = normalizedData[variation];
              break;
            }
          }
        });

        // Check required fields
        const missingFields = requiredFields.filter(
          (field) => !processedData[field]
        );
        if (missingFields.length > 0) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Missing required fields: ${missingFields.join(", ")}`,
          });
          continue;
        }

        // Validate membership type
        const membershipType = processedData.type.toLowerCase();
        if (!["ordinary", "lifetime"].includes(membershipType)) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Invalid membership type: ${processedData.type}. Must be 'ordinary' or 'lifetime'`,
          });
          continue;
        }

        // Parse and validate purchase date if provided
        let purchaseDate = new Date(); // Default to current date
        if (processedData.purchaseDate) {
          const parsedDate = new Date(processedData.purchaseDate);
          if (isNaN(parsedDate.getTime())) {
            results.failed.push({
              row: rowNumber,
              data: memberData,
              error: `Invalid purchase date format: ${processedData.purchaseDate}. Use YYYY-MM-DD or MM/DD/YYYY`,
            });
            continue;
          }
          purchaseDate = parsedDate;
        }

        // Calculate validity dates based on purchase date
        const validFrom = new Date(purchaseDate);
        let validUntil;

        if (membershipType === "lifetime") {
          validUntil = new Date(2099, 11, 31); // Far future date for lifetime members
        } else {
          // For ordinary membership, add 1 year to purchase date
          validUntil = new Date(validFrom);
          validUntil.setFullYear(validUntil.getFullYear() + 1);
        }

        // Prepare membership document
        const membershipDoc = {
          name: processedData.name,
          email: processedData.email.toLowerCase().trim(),
          mobile: processedData.mobile,
          designation: processedData.designation,
          division: processedData.division,
          department: processedData.department,
          place: processedData.place || "Not specified",
          unit: processedData.unit || "Not specified",
          type: membershipType,
          paymentMethod: processedData.paymentMethod || "upi",
          paymentAmount:
            processedData.paymentAmount ||
            (membershipType === "lifetime" ? 5000 : 500),
          paymentStatus: "pending",
          status: "pending",
          validFrom: validFrom,
          validUntil: validUntil,
          paymentDate: purchaseDate,
        };

        // Check for duplicate email
        const existingMember = await Membership.findOne({
          email: membershipDoc.email,
        });
        if (existingMember) {
          results.failed.push({
            row: rowNumber,
            data: memberData,
            error: `Email already exists: ${membershipDoc.email}`,
          });
          continue;
        }

        // Create and save membership (validity dates already set above)
        const membership = new Membership(membershipDoc);
        await membership.save();

        results.success.push({
          row: rowNumber,
          membershipId: membership.membershipId,
          name: membership.name,
          email: membership.email,
          validFrom: membership.validFrom,
          validUntil: membership.validUntil,
        });
      } catch (error) {
        results.failed.push({
          row: rowNumber,
          data: memberData,
          error: error.message || "Unknown error",
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: `Processed ${results.total} records. ${results.success.length} successful, ${results.failed.length} failed.`,
      results,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Server error during bulk upload",
      error: err.message,
    });
  }
};

/**
 * Upgrade Membership from Ordinary to Lifetime
 * POST /api/memberships/upgrade
 */
exports.upgradeMembership = async (req, res) => {
  try {
    const { email, paymentAmount } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Check if user already has lifetime membership
    if (user.membershipType === "Lifetime") {
      return res.status(400).json({
        success: false,
        message: "User already has lifetime membership",
      });
    }

    // Check if user has ordinary membership
    if (user.membershipType !== "Ordinary") {
      return res.status(400).json({
        success: false,
        message: "User must have ordinary membership to upgrade",
      });
    }

    // Find active membership record
    const existingMembership = await Membership.findOne({
      email: email,
      status: "active",
      type: "ordinary",
    }).sort({ createdAt: -1 });

    if (!existingMembership) {
      return res.status(404).json({
        success: false,
        message: "No active ordinary membership found for this user",
      });
    }

    // Create new lifetime membership record
    const upgradeMembership = new Membership({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      designation: user.designation,
      division: user.division,
      department: user.department,
      place: existingMembership.place,
      unit: existingMembership.unit,
      type: "lifetime",
      paymentMethod: "upi",
      paymentStatus: "pending",
      paymentAmount: paymentAmount,
      status: "pending",
      user: user._id,
      personalDetails: existingMembership.personalDetails,
      professionalDetails: existingMembership.professionalDetails,
    });

    upgradeMembership.setValidity();
    await upgradeMembership.save();

    const options = {
      amount: Math.round(paymentAmount * 100),
      currency: "INR",
      receipt: membership_upgrade_,
      notes: {
        membershipId: upgradeMembership._id.toString(),
        type: "lifetime",
        email: email,
        upgrade: true,
        previousMembershipId: existingMembership._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    upgradeMembership.razorpayOrderId = order.id;
    await upgradeMembership.save();

    res.status(201).json({
      success: true,
      message: "Upgrade order created successfully",
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      membershipDbId: upgradeMembership._id,
      membershipId: upgradeMembership.membershipId,
      amount: paymentAmount,
      isUpgrade: true,
      currentMemberId: user.memberId,
    });
  } catch (err) {
    console.error("Upgrade membership error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
