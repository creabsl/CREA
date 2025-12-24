const EventAd = require('../models/eventAdModel')
const path = require('path')
const fs = require('fs')

// Get all active event ads
exports.getActiveEventAds = async (req, res) => {
  try {
    const ads = await EventAd.find({ isActive: true }).sort({ priority: -1, createdAt: -1 })
    const validAds = ads.filter(ad => ad.isValid())
    
    const result = {
      left: validAds.filter(ad => ad.position === 'left'),
      right: validAds.filter(ad => ad.position === 'right')
    }
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all event ads (admin only)
exports.getAllEventAds = async (req, res) => {
  try {
    const ads = await EventAd.find().sort({ createdAt: -1 })
    res.json(ads)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create or update event ad
exports.createOrUpdateEventAd = async (req, res) => {
  try {
    const { id, position, title, link, isActive, endDate, priority } = req.body
    
    const imageUrl = req.file ? `/uploads/ads/${req.file.filename}` : undefined
    
    if (id) {
      // Update existing ad
      let ad = await EventAd.findById(id)
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' })
      }
      
      // Delete old image if new one is uploaded
      if (imageUrl && ad.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', ad.imageUrl)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      
      ad.title = title || ad.title
      if (imageUrl) ad.imageUrl = imageUrl
      ad.link = link || ad.link
      ad.position = position || ad.position
      ad.isActive = isActive !== undefined ? isActive : ad.isActive
      ad.priority = priority !== undefined ? priority : ad.priority
      ad.endDate = endDate !== undefined ? endDate : ad.endDate
      await ad.save()
      
      res.json(ad)
    } else {
      // Create new ad
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image is required for new ad' })
      }
      
      const ad = await EventAd.create({
        position,
        title,
        imageUrl,
        link,
        isActive: isActive !== undefined ? isActive : true,
        priority: priority || 0,
        endDate: endDate || null
      })
      
      res.json(ad)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete event ad
exports.deleteEventAd = async (req, res) => {
  try {
    const ad = await EventAd.findById(req.params.id)
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }
    
    // Delete image file
    if (ad.imageUrl) {
      const imagePath = path.join(__dirname, '..', ad.imageUrl)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }
    
    await EventAd.findByIdAndDelete(req.params.id)
    res.json({ message: 'Ad deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Toggle ad active status
exports.toggleEventAdStatus = async (req, res) => {
  try {
    const ad = await EventAd.findById(req.params.id)
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }
    
    ad.isActive = !ad.isActive
    await ad.save()
    
    res.json(ad)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
