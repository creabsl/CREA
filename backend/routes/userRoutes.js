const express = require('express');
const router = express.Router();
const { registerUser, loginUser, listUsers, updateUser, getProfile, updateProfile, activateMembership } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Self profile (any authenticated user)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Membership activation
router.post('/activate-membership', protect, activateMembership);

// Admin: Generate Member ID for a user
router.post('/:id/generate-member-id', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/userModel');
    const { sendMail } = require('../config/mailer');
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.membershipType || user.membershipType === 'None') {
      return res.status(400).json({ message: 'User must have a membership type assigned first' });
    }
    
    if (user.memberId) {
      return res.status(400).json({ message: 'User already has a Member ID', memberId: user.memberId });
    }
    
    // Generate Member ID
    const { activateMembership } = require('../controllers/userController');
    const prefix = user.membershipType === 'Ordinary' ? 'ORD' : 'LIF';
    const regex = new RegExp(`^${prefix}-\\d{4}$`);
    const existingUsers = await User.find({ memberId: regex }).select('memberId').lean();
    
    let nextNumber = 1;
    if (existingUsers.length > 0) {
      const numbers = existingUsers.map(u => {
        const match = u.memberId.match(/\d{4}$/);
        return match ? parseInt(match[0], 10) : 0;
      });
      nextNumber = Math.max(...numbers) + 1;
    }
    
    const newMemberId = `${prefix}-${String(nextNumber).padStart(4, '0')}`;
    
    user.memberId = newMemberId;
    user.isMember = true;
    await user.save();
    
    // Send email
    try {
      await sendMail({
        to: user.email,
        subject: 'CREA Membership Activated - Member ID Assigned',
        html: `
          <h2>Welcome to CREA!</h2>
          <p>Dear ${user.name},</p>
          <p>Your membership has been activated by an administrator.</p>
          <p><strong>Your Member ID:</strong> <span style="color: #0d2c54; font-size: 18px; font-weight: bold;">${newMemberId}</span></p>
          <p><strong>Membership Type:</strong> ${user.membershipType}</p>
          <p>Please use this Member ID for all future communications with CREA.</p>
          <br>
          <p>Best regards,<br>CREA Team</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }
    
    return res.json({ success: true, memberId: newMemberId, membershipType: user.membershipType });
  } catch (error) {
    console.error('Generate Member ID error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin member management
router.get('/', protect, adminOnly, listUsers);
router.put('/:id', protect, adminOnly, updateUser);

module.exports = router;
