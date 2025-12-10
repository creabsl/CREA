const express = require('express');
const router = express.Router();
const {
  getBodyMembers,
  getBodyMemberById,
  createBodyMember,
  updateBodyMember,
  deleteBodyMember
} = require('../controllers/bodyMemberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBodyMembers);
router.get('/:id', getBodyMemberById);

// Admin-only routes
router.post('/', protect, adminOnly, createBodyMember);
router.put('/:id', protect, adminOnly, updateBodyMember);
router.delete('/:id', protect, adminOnly, deleteBodyMember);

module.exports = router;
