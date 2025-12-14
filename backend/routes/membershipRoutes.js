const express = require('express');
const router = express.Router();
const { 
  submitMembership, 
  listMemberships, 
  updateMembershipStatus,
  renewMembership,
  getMembershipStats,
  bulkUploadMembers
} = require('../controllers/membershipController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadBulkMembers } = require('../middleware/upload');

// Public routes
router.post('/', protect, submitMembership);

// Protected routes (logged-in users)
router.get('/stats', protect, getMembershipStats);

// Admin routes
router.get('/', protect, adminOnly, listMemberships);
router.put('/:id/status', protect, adminOnly, updateMembershipStatus);
router.put('/:id/renew', protect, adminOnly, renewMembership);
router.post('/bulk-upload', protect, adminOnly, uploadBulkMembers, bulkUploadMembers);

module.exports = router;
