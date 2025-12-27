const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  listUsers,
  updateUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Self profile (any authenticated user)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin member management
router.get("/", protect, adminOnly, listUsers);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const User = require("../models/userModel");
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
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
        message: "No user IDs provided",
      });
    }

    const User = require("../models/userModel");
    const result = await User.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} user(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting users",
      error: error.message,
    });
  }
});

module.exports = router;
