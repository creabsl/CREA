exports.crud = (Model) => ({
  list: async (_req, res) => {
    try { const items = await Model.find().sort({ createdAt: -1 }); return res.json(items); }
    catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
  },
  create: async (req, res) => {
    try { const item = await Model.create(req.body); return res.status(201).json(item); }
    catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
  },
  update: async (req, res) => {
    try { const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: 'Not found' }); return res.json(item); }
    catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
  },
  remove: async (req, res) => {
    try { const item = await Model.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); return res.json({ success: true }); }
    catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
  },
});
