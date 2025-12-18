const express = require('express');
const path = require('path');
const fs = require('fs');

const Circular = require('../models/circularModel');
const Manual = require('../models/manualModel');
const CourtCase = require('../models/courtCaseModel');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

function isHttpUrl(url) {
	return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}

function toIso(d) {
	if (!d) return null;
	const dt = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(dt.getTime())) return null;
	return dt.toISOString();
}

function docDownloadUrl(type, id) {
	return `/api/documents/${type}/${id}/download`;
}

router.get('/', protect, async (_req, res) => {
	try {
		const [circulars, manuals, courtCases] = await Promise.all([
			Circular.find().sort({ createdAt: -1 }).lean(),
			Manual.find().sort({ createdAt: -1 }).lean(),
			CourtCase.find().sort({ createdAt: -1 }).lean(),
		]);

		const docs = [
			...circulars.map((c) => ({
				id: String(c._id),
				type: 'circular',
				title: c.title,
				uploadedAt: toIso(c.createdAt),
				label: c.subject || '',
				fileName: c.fileName || null,
				mimeType: c.mimeType || null,
				size: typeof c.size === 'number' ? c.size : null,
				externalUrl: isHttpUrl(c.url) ? c.url : null,
				downloadUrl: c.fileName ? docDownloadUrl('circular', String(c._id)) : null,
			})),
			...manuals.map((m) => ({
				id: String(m._id),
				type: 'manual',
				title: m.title,
				uploadedAt: toIso(m.createdAt),
				label: m.category || 'general',
				fileName: m.fileName || null,
				mimeType: m.mimeType || null,
				size: typeof m.size === 'number' ? m.size : null,
				externalUrl: isHttpUrl(m.url) ? m.url : null,
				downloadUrl: m.fileName ? docDownloadUrl('manual', String(m._id)) : null,
			})),
			...courtCases.map((cc) => ({
				id: String(cc._id),
				type: 'court-case',
				title: cc.caseNumber,
				uploadedAt: toIso(cc.createdAt),
				label: cc.status || 'ongoing',
				fileName: cc.fileName || null,
				mimeType: cc.mimeType || null,
				size: typeof cc.size === 'number' ? cc.size : null,
				externalUrl: isHttpUrl(cc.url) ? cc.url : null,
				downloadUrl: cc.fileName ? docDownloadUrl('court-case', String(cc._id)) : null,
			})),
		].sort((a, b) => {
			const ad = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
			const bd = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
			return bd - ad;
		});

		return res.json(docs);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'Server error' });
	}
});

router.get('/:type/:id/download', protect, async (req, res) => {
	try {
		const { type, id } = req.params;

		let Model;
		let subdir;
		switch (type) {
			case 'circular':
				Model = Circular;
				subdir = 'circulars';
				break;
			case 'manual':
				Model = Manual;
				subdir = 'manuals';
				break;
			case 'court-case':
				Model = CourtCase;
				subdir = 'court-cases';
				break;
			default:
				return res.status(400).json({ message: 'Invalid document type' });
		}

		const doc = await Model.findById(id).lean();
		if (!doc) return res.status(404).json({ message: 'Not found' });
		if (!doc.fileName) return res.status(404).json({ message: 'No file for this document' });

		const filePath = path.join(__dirname, '..', 'uploads', subdir, doc.fileName);
		if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

		res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
		res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);
		return fs.createReadStream(filePath).pipe(res);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
