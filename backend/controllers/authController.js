const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const { sendMail } = require('../config/mailer');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const storeRefreshToken = async (userId, refreshToken) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await User.findByIdAndUpdate(userId, { refreshToken, refreshTokenExpiresAt: expiresAt });
};

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

exports.requestOtp = async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await Otp.deleteMany({ email }); // invalidate previous
    await Otp.create({ email, code, expiresAt });

    const subject = 'CREA verification code';
    const html = `<p>Hi${name ? ' ' + name : ''},</p><p>Your CREA verification code is <b>${code}</b>. It expires in 15 minutes.</p>`;
    await sendMail({ to: email, subject, html, text: `Your CREA verification code is ${code}` });
    return res.json({ success: true });
  } catch (e) {
    console.error('requestOtp error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, code, name, password } = req.body || {};
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });
    const record = await Otp.findOne({ email, code });
    if (!record) return res.status(400).json({ message: 'Invalid code' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: 'Code expired' });

    // mark verified and consume
    record.verified = true;
    await record.save();
    await Otp.deleteMany({ email });

    // Ensure user exists; if not, create
  let user = await User.findOne({ email });
    if (!user) {
      if (!password || !name) return res.status(400).json({ message: 'Name and password required to create account' });
      user = await User.create({ name, email, password, role: 'member' });
    }
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token, refreshToken });
  } catch (e) {
    console.error('verifyOtp error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (new Date() > user.refreshTokenExpiresAt) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const newToken = generateToken(user._id);
    return res.json({ accessToken: newToken });
  } catch (e) {
    console.error('refreshAccessToken error:', e.message);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null, refreshTokenExpiresAt: null });
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (e) {
    console.error('logout error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Always return success for security (don't reveal if account exists)
    
    if (user) {
      const resetCode = generateCode();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      
      // Store reset code in user
      await User.findByIdAndUpdate(user._id, { 
        passwordResetCode: resetCode,
        passwordResetExpiresAt: expiresAt
      });

      // Send reset email
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(email)}&code=${resetCode}`;
      const subject = 'CREA Password Reset';
      const html = `<p>Hi ${user.name || 'there'},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link expires in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>`;
      
      await sendMail({ 
        to: email, 
        subject, 
        html, 
        text: `Click here to reset your password: ${resetLink}` 
      });
    }
    
    return res.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });
  } catch (e) {
    console.error('forgotPassword error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await Otp.deleteMany({ email });
    await Otp.create({ email, code, expiresAt });

    const subject = 'CREA Password Reset OTP';
    const html = `<p>Hi ${user.name || 'there'},</p>
      <p>Your password reset code is <b>${code}</b>. It expires in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>`;
    
    await sendMail({ 
      to: email, 
      subject, 
      html, 
      text: `Your password reset code is ${code}` 
    });

    return res.json({ success: true, message: 'OTP sent to your email' });
  } catch (e) {
    console.error('sendPasswordResetOtp error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    const record = await Otp.findOne({ email, code });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    // Mark as verified but keep for reset-password to consume
    record.verified = true;
    await record.save();

    return res.json({ success: true, message: 'OTP verified. You can now reset your password.' });
  } catch (e) {
    console.error('verifyPasswordResetOtp error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body || {};
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const record = await Otp.findOne({ email, code });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    if (!record.verified) return res.status(400).json({ message: 'OTP not verified' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete OTP
    await Otp.deleteOne({ _id: record._id });

    const subject = 'Password Reset Successful';
    const html = `<p>Hi ${user.name || 'there'},</p>
      <p>Your password has been successfully reset.</p>
      <p>If you didn't make this change, please contact support.</p>`;
    
    await sendMail({ 
      to: email, 
      subject, 
      html, 
      text: 'Your password has been successfully reset.' 
    });

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (e) {
    console.error('resetPassword error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};
