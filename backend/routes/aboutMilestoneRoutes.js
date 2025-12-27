const express = require("express");
const router = express.Router();
const {
  getMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  deleteMilestones,
} = require("../controllers/aboutMilestoneController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getMilestones);
router.get("/:id", getMilestoneById);

// Admin routes
router.post("/", protect, adminOnly, createMilestone);
router.put("/:id", protect, adminOnly, updateMilestone);
router.delete("/:id", protect, adminOnly, deleteMilestone);
router.post("/bulk-delete", protect, adminOnly, deleteMilestones);

module.exports = router;
