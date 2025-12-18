const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/authMiddleware');

function ensureDir(dirPath) {
  try { 
    fs.mkdirSync(dirPath, { recursive: true }); 
  } catch (e) {
    console.error('Error creating directory:', e);
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads', 'events');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(_req, file, cb) {
  const ok = file.mimetype.startsWith('image/');
  if (!ok) return cb(new Error('Only images are allowed'));
  return cb(null, true);
}

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Multiple photo upload endpoint
router.post('/multiple', protect, adminOnly, upload.array('photos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map(file => 
      `/uploads/events/${file.filename}`
    );

    res.json({ 
      message: 'Files uploaded successfully', 
      urls,
      count: urls.length 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

module.exports = router;
