const express = require('express');
const router = express.Router();
const {
  getActiveAchievements,
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', getActiveAchievements);

// Protected routes (admin only)
router.get('/', protect, adminOnly, getAllAchievements);
router.get('/:id', protect, adminOnly, getAchievementById);
router.post('/', protect, adminOnly, createAchievement);
router.put('/:id', protect, adminOnly, updateAchievement);
router.delete('/:id', protect, adminOnly, deleteAchievement);

module.exports = router;
