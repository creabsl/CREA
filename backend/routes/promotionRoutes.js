const express = require('express');
const router = express.Router();
const {
  getActivePromotions,
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion
} = require('../controllers/promotionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route - get active promotions
router.get('/active', getActivePromotions);

// Admin routes - protected
router.get('/', protect, adminOnly, getAllPromotions);
router.get('/:id', protect, adminOnly, getPromotionById);
router.post('/', protect, adminOnly, createPromotion);
router.put('/:id', protect, adminOnly, updatePromotion);
router.delete('/:id', protect, adminOnly, deletePromotion);

module.exports = router;
