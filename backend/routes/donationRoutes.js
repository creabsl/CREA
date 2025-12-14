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

// Public route - create donation
router.post('/', createDonation);

// Admin routes - protected
router.get('/', protect, adminOnly, getAllDonations);
router.get('/:id', protect, adminOnly, getDonationById);
router.put('/:id', protect, adminOnly, updateDonation);
router.delete('/:id', protect, adminOnly, deleteDonation);

module.exports = router;
