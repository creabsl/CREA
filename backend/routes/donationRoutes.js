const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route - create donation
router.post('/', createDonation);

// Admin routes - protected
router.get('/', protect, admin, getAllDonations);
router.get('/:id', protect, admin, getDonationById);
router.put('/:id', protect, admin, updateDonation);
router.delete('/:id', protect, admin, deleteDonation);

module.exports = router;
