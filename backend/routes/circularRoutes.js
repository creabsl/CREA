const express = require('express');
const router = express.Router();
const Circular = require('../models/circularModel');
const { crud } = require('../controllers/basicCrudFactory');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/upload');

const c = crud(Circular);
router.get('/', protect, c.list);

// Create circular with optional file
router.post('/', protect, adminOnly, uploadSingle('circulars'), async (req, res) => {
	try {
		const body = req.body || {};
		const doc = {
			title: body.title,
			subject: body.subject,
			dateOfIssue: body.dateOfIssue ? new Date(body.dateOfIssue) : undefined,
		};
		if (req.file) {
			doc.fileName = req.file.filename;
			doc.mimeType = req.file.mimetype;
			doc.size = req.file.size;
			doc.url = `/uploads/circulars/${req.file.filename}`;
		} else if (body.url) {
			doc.url = body.url;
		}
		const created = await Circular.create(doc);
		return res.status(201).json(created);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'Server error' });
	}
});

router.put('/:id', protect, adminOnly, uploadSingle('circulars'), async (req, res) => {
	try {
		const patch = { ...req.body };
		if (patch.dateOfIssue) patch.dateOfIssue = new Date(patch.dateOfIssue);
		if (req.file) {
			patch.fileName = req.file.filename;
			patch.mimeType = req.file.mimetype;
			patch.size = req.file.size;
			patch.url = `/uploads/circulars/${req.file.filename}`;
		}
		const updated = await Circular.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
		if (!updated) return res.status(404).json({ message: 'Not found' });
		return res.json(updated);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'Server error' });
	}
});

router.delete('/:id', protect, adminOnly, c.remove);
module.exports = router;
