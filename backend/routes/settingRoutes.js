const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route to get settings (for membership prices, etc.)
router.get('/', settingController.getSettings);
router.get('/:key', settingController.getSettingByKey);

// Admin-only routes
router.post('/', protect, adminOnly, settingController.upsertSetting);
router.put('/bulk', protect, adminOnly, settingController.updateMultipleSettings);
router.delete('/:key', protect, adminOnly, settingController.deleteSetting);
router.post('/initialize', protect, adminOnly, settingController.initializeDefaultSettings);

module.exports = router;
