const express = require("express");
const router = express.Router();

const {
  getPastEvents,
  getPastEventById,
  createPastEvent,
  updatePastEvent,
  deletePastEvent,
  deletePastEvents,
} = require("../controllers/pastEventController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getPastEvents);
router.get("/:id", getPastEventById);

// Protected admin routes
router.post("/", protect, adminOnly, createPastEvent);
router.put("/:id", protect, adminOnly, updatePastEvent);
router.delete("/:id", protect, adminOnly, deletePastEvent);
router.post("/bulk-delete", protect, adminOnly, deletePastEvents);

module.exports = router;
