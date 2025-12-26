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
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const Membership = require("../models/membershipModel");
    const membership = await Membership.findByIdAndDelete(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.json({
      success: true,
      message: "Membership deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting membership:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting membership",
      error: error.message,
    });
  }
});
router.post("/bulk-delete", protect, adminOnly, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No membership IDs provided",
      });
    }

    const Membership = require("../models/membershipModel");
    const result = await Membership.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} membership(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting memberships:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting memberships",
      error: error.message,
    });
  }
});
router.post(
  "/bulk-upload",
  protect,
  adminOnly,
  uploadBulkMembers,
  bulkUploadMembers
);

module.exports = router;
