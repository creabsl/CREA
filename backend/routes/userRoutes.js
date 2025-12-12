const express = require('express');
const router = express.Router();
const { registerUser, loginUser, listUsers, updateUser, getProfile, updateProfile, activateMembership, generateMemberIdForUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Self profile (any authenticated user)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Membership activation
router.post('/activate-membership', protect, activateMembership);

// Admin member management
router.get('/', protect, adminOnly, listUsers);
router.put('/:id', protect, adminOnly, updateUser);
router.post('/:id/generate-member-id', protect, adminOnly, generateMemberIdForUser);

module.exports = router;
