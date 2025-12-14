const express = require('express')
const router = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const controller = require('../controllers/advertisementController')

// Public routes
router.get('/active', controller.getActive)

// Protected admin routes
router.get('/', protect, adminOnly, controller.getAll)
router.get('/:id', protect, adminOnly, controller.getById)
router.post('/', protect, adminOnly, controller.create)
router.put('/:id', protect, adminOnly, controller.update)
router.delete('/:id', protect, adminOnly, controller.delete)

module.exports = router
