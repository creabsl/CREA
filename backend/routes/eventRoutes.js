const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/upload');

router.get('/', getEvents);
router.post('/', protect, adminOnly, uploadMultiple('events'), createEvent);
router.put('/:id', protect, adminOnly, uploadMultiple('events'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
