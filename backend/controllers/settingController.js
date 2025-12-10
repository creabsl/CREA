const MembershipPriceSetting = require('../models/settingModel');

// Get all settings or filter by category
exports.getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const settings = await MembershipPriceSetting.find(filter);
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single setting by key
exports.getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await MembershipPriceSetting.findOne({ key });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update a setting
exports.upsertSetting = async (req, res) => {
  try {
    const { key, value, description, category } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'Key and value are required' });
    }

    const setting = await MembershipPriceSetting.findOneAndUpdate(
      { key },
      { value, description, category },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'Setting updated successfully', setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update multiple settings at once
exports.updateMultipleSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({ success: false, message: 'Settings array is required' });
    }

    const updatePromises = settings.map(({ key, value, description, category }) => {
      if (!key || value === undefined) {
        throw new Error('Each setting must have key and value');
      }
      return MembershipPriceSetting.findOneAndUpdate(
        { key },
        { value, description, category },
        { new: true, upsert: true, runValidators: true }
      );
    });

    const updatedSettings = await Promise.all(updatePromises);

    res.json({ success: true, message: 'Settings updated successfully', settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a setting
exports.deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await MembershipPriceSetting.findOneAndDelete({ key });
    
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }

    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initialize default settings (can be called on first run)
exports.initializeDefaultSettings = async (req, res) => {
  try {
    const defaultSettings = [
      {
        key: 'membership_ordinary_price',
        value: 500,
        description: 'Price for ordinary membership (annual)',
        category: 'Membership Settings'
      },
      {
        key: 'membership_lifetime_price',
        value: 10000,
        description: 'Price for lifetime membership (one-time)',
        category: 'Membership Settings'
      }
    ];

    const promises = defaultSettings.map(setting =>
      MembershipPriceSetting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      )
    );

    await Promise.all(promises);

    res.json({ success: true, message: 'Default settings initialized' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
