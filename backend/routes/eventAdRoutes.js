const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const { uploadAdImage } = require('../middleware/upload')
const {
  getActiveEventAds,
  getAllEventAds,
  createOrUpdateEventAd,
  deleteEventAd,
  toggleEventAdStatus
} = require('../controllers/eventAdController')

// Public route - get active ads
router.get('/active', getActiveEventAds)

// Admin routes
router.get('/', protect, adminOnly, getAllEventAds)
router.post('/', protect, adminOnly, uploadAdImage, createOrUpdateEventAd)
router.delete('/:id', protect, adminOnly, deleteEventAd)
router.patch('/:id/toggle', protect, adminOnly, toggleEventAdStatus)

module.exports = router
