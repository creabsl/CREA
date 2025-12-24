const Advertisement = require('../models/advertisementModel')

// Get all active advertisements (for public display)
exports.getActive = async (req, res) => {
  try {
    const now = new Date()
    const advertisements = await Advertisement.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    })
      .populate('createdBy', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .lean()

    res.json({ success: true, data: advertisements })
  } catch (error) {
    console.error('Error fetching active advertisements:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Get all advertisements (for admin)
exports.getAll = async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    res.json({ success: true, data: advertisements })
  } catch (error) {
    console.error('Error fetching advertisements:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Get single advertisement by ID
exports.getById = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean()

    if (!advertisement) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' })
    }

    res.json({ success: true, data: advertisement })
  } catch (error) {
    console.error('Error fetching advertisement:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Create new advertisement
exports.create = async (req, res) => {
  try {
    const { title, description, type, priority, link, imageUrl, videoUrl, isActive, startDate, endDate } = req.body

    const advertisement = await Advertisement.create({
      title,
      description,
      type,
      priority,
      link,
      imageUrl,
      videoUrl,
      isActive,
      startDate,
      endDate,
      createdBy: req.user._id
    })

    const populated = await Advertisement.findById(advertisement._id)
      .populate('createdBy', 'name email')
      .lean()

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    console.error('Error creating advertisement:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Update advertisement
exports.update = async (req, res) => {
  try {
    const { title, description, type, priority, link, imageUrl, videoUrl, isActive, startDate, endDate } = req.body

    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        type,
        priority,
        link,
        imageUrl,
        videoUrl,
        isActive,
        startDate,
        endDate
      },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .lean()

    if (!advertisement) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' })
    }

    res.json({ success: true, data: advertisement })
  } catch (error) {
    console.error('Error updating advertisement:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Delete advertisement
exports.delete = async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndDelete(req.params.id)

    if (!advertisement) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' })
    }

    res.json({ success: true, message: 'Advertisement deleted successfully' })
  } catch (error) {
    console.error('Error deleting advertisement:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
