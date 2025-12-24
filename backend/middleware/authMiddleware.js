const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes
// Checks Authorization: Bearer <token>
module.exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      return next();
    } catch (error) {
      // Only log critical errors, not expired token errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please refresh' });
      }
      if (error.name !== 'JsonWebTokenError') {
        console.error('Auth error:', error.message);
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Admin-only guard
module.exports.adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  return next();
};
