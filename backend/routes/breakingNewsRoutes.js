const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllBreakingNews,
  getActiveBreakingNews,
  getBreakingNewsById,
  createBreakingNews,
  updateBreakingNews,
  deleteBreakingNews,
  toggleBreakingNewsStatus
} = require('../controllers/breakingNewsController');

// Public routes
router.get('/active', getActiveBreakingNews);

// Protected routes (admin only)
router.get('/', protect, adminOnly, getAllBreakingNews);
router.get('/:id', protect, adminOnly, getBreakingNewsById);
router.post('/', protect, adminOnly, createBreakingNews);
router.put('/:id', protect, adminOnly, updateBreakingNews);
router.delete('/:id', protect, adminOnly, deleteBreakingNews);
router.patch('/:id/toggle', protect, adminOnly, toggleBreakingNewsStatus);

module.exports = router;
