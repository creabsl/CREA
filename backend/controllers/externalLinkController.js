const ExternalLink = require('../models/externalLinkModel');

// Get all active external links
exports.getExternalLinks = async (req, res) => {
  try {
    const links = await ExternalLink.find({ isActive: true })
      .sort({ category: 1, order: 1 })
      .select('-__v');
    
    // Group links by category
    const groupedLinks = links.reduce((acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push(link);
      return acc;
    }, {});

    res.json(groupedLinks);
  } catch (err) {
    console.error('Get external links error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create new external link
exports.createExternalLink = async (req, res) => {
  try {
    const { title, url, category, description, order } = req.body;

    const link = new ExternalLink({
      title,
      url,
      category,
      description,
      order: order || 0
    });

    await link.save();
    res.status(201).json(link);
  } catch (err) {
    console.error('Create external link error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update external link
exports.updateExternalLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, category, description, order, isActive } = req.body;

    const link = await ExternalLink.findById(id);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    link.title = title || link.title;
    link.url = url || link.url;
    link.category = category || link.category;
    link.description = description || link.description;
    link.order = order ?? link.order;
    link.isActive = isActive ?? link.isActive;

    await link.save();
    res.json(link);
  } catch (err) {
    console.error('Update external link error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete external link
exports.deleteExternalLink = async (req, res) => {
  try {
    const { id } = req.params;
    
    const link = await ExternalLink.findById(id);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await link.deleteOne();
    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    console.error('Delete external link error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};