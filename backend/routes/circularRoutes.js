const express = require("express");
const router = express.Router();
const Circular = require("../models/circularModel");
const { crud } = require("../controllers/basicCrudFactory");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadSingle } = require("../middleware/upload");

const c = crud(Circular);
router.get("/", c.list);

// Create circular with optional file
router.post(
  "/",
  protect,
  adminOnly,
  uploadSingle("circulars"),
  async (req, res) => {
    try {
      const body = req.body || {};
      
      // Validate required fields
      const title = body.boardNumber || body.title;
      if (!title || !title.trim()) {
        return res.status(400).json({ message: "Board Number/Title is required" });
      }
      if (!body.subject || !body.subject.trim()) {
        return res.status(400).json({ message: "Subject is required" });
      }
      if (!body.dateOfIssue) {
        return res.status(400).json({ message: "Date of Issue is required" });
      }
      
      const doc = {
        title: title.trim(),
        subject: body.subject.trim(),
        dateOfIssue: new Date(body.dateOfIssue),
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
      console.error("Circular creation error:", e);
      return res.status(500).json({ 
        message: e.message || "Server error creating circular" 
      });
    }
  }
);

router.put(
  "/:id",
  protect,
  adminOnly,
  uploadSingle("circulars"),
  async (req, res) => {
    try {
      const patch = { ...req.body };
      
      // Map boardNumber to title if provided
      if (patch.boardNumber) {
        patch.title = patch.boardNumber.trim();
        delete patch.boardNumber;
      }
      
      // Trim string fields if they exist
      if (patch.title) patch.title = patch.title.trim();
      if (patch.subject) patch.subject = patch.subject.trim();
      if (patch.dateOfIssue) patch.dateOfIssue = new Date(patch.dateOfIssue);
      
      if (req.file) {
        patch.fileName = req.file.filename;
        patch.mimeType = req.file.mimetype;
        patch.size = req.file.size;
        patch.url = `/uploads/circulars/${req.file.filename}`;
      }
      
      const updated = await Circular.findByIdAndUpdate(req.params.id, patch, {
        new: true,
        runValidators: true,
      });
      
      if (!updated) return res.status(404).json({ message: "Circular not found" });
      return res.json(updated);
    } catch (e) {
      console.error("Circular update error:", e);
      return res.status(500).json({ 
        message: e.message || "Server error updating circular" 
      });
    }
  }
);

router.delete("/:id", protect, adminOnly, c.remove);
module.exports = router;
