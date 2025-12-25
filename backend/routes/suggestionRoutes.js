const express = require('express');
const router = express.Router();
const Suggestion = require('../models/suggestionModel');
const { crud } = require('../controllers/basicCrudFactory');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');

const c = crud(Suggestion);

router.get('/', c.list);

// Custom route to handle file uploads
router.post('/', upload.array('files', 5), async (req, res) => {
  try {
    const { userId, userName, text } = req.body;
    // Store full URL paths instead of just filenames
    const fileNames = req.files ? req.files.map(f => `/uploads/suggestions/${f.filename}`) : [];
    
    const suggestion = await Suggestion.create({
      userId,
      userName,
      text,
      fileNames
    });
    
    return res.status(201).json(suggestion);
  } catch (error) {
    console.error('Error creating suggestion:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, adminOnly, c.update);
router.delete('/:id', protect, adminOnly, c.remove);
module.exports = router;
