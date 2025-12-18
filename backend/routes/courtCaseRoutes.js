const express = require('express');
const router = express.Router();
const CourtCase = require('../models/courtCaseModel');
const { crud } = require('../controllers/basicCrudFactory');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/upload');

const c = crud(CourtCase);
router.get('/', protect, c.list);

// Create court case with optional file upload
router.post('/', protect, adminOnly, uploadSingle('court-cases'), async (req, res) => {
	try {
		const body = req.body || {};
		const doc = {
			caseNumber: body.caseNumber,
			date: body.date,
			subject: body.subject,
			status: body.status,
		};
		if (req.file) {
			doc.fileName = req.file.filename;
			doc.mimeType = req.file.mimetype;
			doc.size = req.file.size;
			doc.url = `/uploads/court-cases/${req.file.filename}`;
		} else if (body.url) {
			doc.url = body.url;
		}
		const created = await CourtCase.create(doc);
		return res.status(201).json(created);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'Server error' });
	}
});

// Update court case: allow replacing file or updating fields
router.put('/:id', protect, adminOnly, uploadSingle('court-cases'), async (req, res) => {
	try {
		const patch = { ...req.body };
		if (req.file) {
			patch.fileName = req.file.filename;
			patch.mimeType = req.file.mimetype;
			patch.size = req.file.size;
			patch.url = `/uploads/court-cases/${req.file.filename}`;
		}
		const updated = await CourtCase.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
		if (!updated) return res.status(404).json({ message: 'Not found' });
		return res.json(updated);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'Server error' });
	}
});

router.delete('/:id', protect, adminOnly, c.remove);

module.exports = router;
