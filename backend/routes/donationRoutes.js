const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const {
  createOrder,
  verifyPayment,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Payment routes (public)
router.post('/create-order', (req, res, next) => {
  console.log('[Donation Route] POST /create-order hit');
  console.log('[Donation Route] Request body:', req.body);
  createOrder(req, res, next);
});
router.post('/verify-payment', verifyPayment);

// Download receipt (public - requires donation ID)
router.get('/receipt/:donationId', (req, res) => {
  try {
    const receiptPath = path.join(__dirname, `../uploads/receipts/donation-receipt-${req.params.donationId}.pdf`);
    
    if (!fs.existsSync(receiptPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receipt not found' 
      });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="donation-receipt-${req.params.donationId}.pdf"`);
    res.sendFile(receiptPath);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading receipt',
      error: error.message 
    });
  }
});

// Admin routes - protected
router.get('/', protect, adminOnly, getAllDonations);
router.get('/:id', protect, adminOnly, getDonationById);
router.put('/:id', protect, adminOnly, updateDonation);
router.delete('/:id', protect, adminOnly, deleteDonation);

module.exports = router;
