const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, refreshAccessToken, logout, forgotPassword, sendPasswordResetOtp, verifyPasswordResetOtp, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/send-password-reset-otp', sendPasswordResetOtp);
router.post('/verify-password-reset-otp', verifyPasswordResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
