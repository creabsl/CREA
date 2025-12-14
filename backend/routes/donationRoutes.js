const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin routes - protected (must come before public routes)
router.get('/', protect, adminOnly, getAllDonations);
router.get('/:id', protect, adminOnly, getDonationById);
router.put('/:id', protect, adminOnly, updateDonation);
router.delete('/:id', protect, adminOnly, deleteDonation);

// Public route - create donation
router.post('/', createDonation);

module.exports = router;
