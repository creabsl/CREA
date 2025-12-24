const express = require('express');
const router = express.Router();
const { 
  getExternalLinks,
  createExternalLink,
  updateExternalLink,
  deleteExternalLink
} = require('../controllers/externalLinkController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getExternalLinks);

// Admin routes
router.post('/', protect, adminOnly, createExternalLink);
router.put('/:id', protect, adminOnly, updateExternalLink);
router.delete('/:id', protect, adminOnly, deleteExternalLink);

module.exports = router;