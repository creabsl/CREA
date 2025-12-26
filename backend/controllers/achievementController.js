const Achievement = require('../models/achievementModel');

// Get all active achievements
exports.getActiveAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true })
      .sort({ date: -1 })
      .limit(20)
      .populate('createdBy', 'name email');

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching active achievements:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
};

// Get all achievements (admin only)
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .sort({ date: -1 })
      .populate('createdBy', 'name email');

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching all achievements:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
};

// Get achievement by ID
exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({ message: 'Failed to fetch achievement' });
  }
};

// Create achievement
exports.createAchievement = async (req, res) => {
  try {
    console.log('Creating achievement with data:', req.body);
    console.log('File uploaded:', req.file);
    
    // Extract data from request
    const { type, title, date, category, description, imageUrl, isActive } = req.body;
    
    // Validate required fields
    if (!type || !title || !date || !description) {
      return res.status(400).json({ 
        message: 'Title, description, and date are required',
        received: { type, title, date, description }
      });
    }
    
    const achievementData = {
      type,
      title,
      date,
      description,
      category: category || '',
      isActive: isActive === 'true' || isActive === true,
      createdBy: req.user._id
    };
    
    // Handle image - either uploaded file or URL
    if (req.file) {
      achievementData.imageUrl = `/uploads/achievements/${req.file.filename}`;
    } else if (imageUrl) {
      achievementData.imageUrl = imageUrl;
    }
    
    const achievement = new Achievement(achievementData);
    await achievement.save();
    
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ 
      message: 'Failed to create achievement',
      error: error.message 
    });
  }
};

// Update achievement
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ message: 'Failed to update achievement' });
  }
};

// Delete achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ message: 'Failed to delete achievement' });
  }
};
