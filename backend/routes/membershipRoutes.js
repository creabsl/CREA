const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const {
  submitMembership,
  listMemberships,
  updateMembershipStatus,
  renewMembership,
  getMembershipStats,
  bulkUploadMembers,
  createOrder,
  verifyPayment,
  upgradeMembership,
} = require("../controllers/membershipController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadBulkMembers } = require("../middleware/upload");

// Payment routes (public)
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/upgrade", upgradeMembership); // Upgrade from Ordinary to Lifetime

// Download receipt (public - requires membership ID)
router.get("/receipt/:membershipId", (req, res) => {
  try {
    const receiptPath = path.join(
      __dirname,
      `../uploads/receipts/membership-receipt-${req.params.membershipId}.pdf`
    );

    if (!fs.existsSync(receiptPath)) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="membership-receipt-${req.params.membershipId}.pdf"`
    );
    res.sendFile(receiptPath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downloading receipt",
      error: error.message,
    });
  }
});

// Public routes
router.post("/", protect, submitMembership);

// Protected routes (logged-in users)
router.get("/stats", protect, getMembershipStats);

// Admin routes
router.get("/", protect, adminOnly, listMemberships);
router.put("/:id/status", protect, adminOnly, updateMembershipStatus);
router.put("/:id/renew", protect, adminOnly, renewMembership);
router.post(
  "/bulk-upload",
  protect,
  adminOnly,
  uploadBulkMembers,
  bulkUploadMembers
);

module.exports = router;
