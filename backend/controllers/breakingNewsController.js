const BreakingNews = require('../models/breakingNewsModel');

// Get all breaking news (with optional filters)
exports.getAllBreakingNews = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    // Auto-expire old news
    const now = new Date();
    await BreakingNews.updateMany(
      { expiresAt: { $lte: now }, isActive: true },
      { isActive: false }
    );

    const news = await BreakingNews.find(filter)
      .populate('createdBy', 'name email')
      .sort({ priority: -1, createdAt: -1 });
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    res.status(500).json({ message: 'Error fetching breaking news', error: error.message });
  }
};

// Get active breaking news (public endpoint)
exports.getActiveBreakingNews = async (req, res) => {
  try {
    const now = new Date();
    
    // Auto-expire old news
    await BreakingNews.updateMany(
      { expiresAt: { $lte: now }, isActive: true },
      { isActive: false }
    );

    const news = await BreakingNews.find({ 
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching active breaking news:', error);
    res.status(500).json({ message: 'Error fetching active breaking news', error: error.message });
  }
};

// Get single breaking news by ID
exports.getBreakingNewsById = async (req, res) => {
  try {
    const news = await BreakingNews.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!news) {
      return res.status(404).json({ message: 'Breaking news not found' });
    }
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    res.status(500).json({ message: 'Error fetching breaking news', error: error.message });
  }
};

// Create new breaking news
exports.createBreakingNews = async (req, res) => {
  try {
    const { title, description, imageUrl, priority, isActive, expiresAt } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const news = new BreakingNews({
      title,
      description,
      imageUrl: imageUrl || '',
      priority: priority || 0,
      isActive: isActive !== undefined ? isActive : true,
      expiresAt: expiresAt || null,
      createdBy: req.user._id
    });

    await news.save();
    await news.populate('createdBy', 'name email');
    
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating breaking news:', error);
    res.status(500).json({ message: 'Error creating breaking news', error: error.message });
  }
};

// Update breaking news
exports.updateBreakingNews = async (req, res) => {
  try {
    const { title, description, imageUrl, priority, isActive, expiresAt } = req.body;

    const news = await BreakingNews.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Breaking news not found' });
    }

    if (title !== undefined) news.title = title;
    if (description !== undefined) news.description = description;
    if (imageUrl !== undefined) news.imageUrl = imageUrl;
    if (priority !== undefined) news.priority = priority;
    if (isActive !== undefined) news.isActive = isActive;
    if (expiresAt !== undefined) news.expiresAt = expiresAt;

    await news.save();
    await news.populate('createdBy', 'name email');
    
    res.json(news);
  } catch (error) {
    console.error('Error updating breaking news:', error);
    res.status(500).json({ message: 'Error updating breaking news', error: error.message });
  }
};

// Delete breaking news
exports.deleteBreakingNews = async (req, res) => {
  try {
    const news = await BreakingNews.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Breaking news not found' });
    }

    await news.deleteOne();
    
    res.json({ message: 'Breaking news deleted successfully' });
  } catch (error) {
    console.error('Error deleting breaking news:', error);
    res.status(500).json({ message: 'Error deleting breaking news', error: error.message });
  }
};

// Toggle active status
exports.toggleBreakingNewsStatus = async (req, res) => {
  try {
    const news = await BreakingNews.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Breaking news not found' });
    }

    news.isActive = !news.isActive;
    await news.save();
    await news.populate('createdBy', 'name email');
    
    res.json(news);
  } catch (error) {
    console.error('Error toggling breaking news status:', error);
    res.status(500).json({ message: 'Error toggling status', error: error.message });
  }
};
