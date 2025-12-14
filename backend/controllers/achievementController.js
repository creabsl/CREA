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
    const achievement = new Achievement({
      ...req.body,
      createdBy: req.user._id
    });
    
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ message: 'Failed to create achievement' });
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
