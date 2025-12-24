const express = require('express');
const router = express.Router();
const {
  listTransfers,
  createTransfer,
  listMine,
  updateTransfer,
  deleteTransfer,
} = require('../controllers/mutualTransferController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', listTransfers);
router.post('/', protect, createTransfer);
router.get('/mine', protect, listMine);
router.patch('/:id', protect, updateTransfer);
router.delete('/:id', protect, deleteTransfer);

module.exports = router;
