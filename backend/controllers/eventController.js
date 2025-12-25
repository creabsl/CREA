const Event = require('../models/eventModel');
const { createNotificationForUsers } = require('./notificationController');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1, createdAt: -1 });
    return res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, isBreakingNews, breaking, location } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description, and date are required' });
    }

    // Handle uploaded photo files from multipart form via uploadMultiple middleware
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => `/uploads/events/${file.filename}`);
    }

    const event = await Event.create({
      title,
      description,
      date,
      isBreakingNews: Boolean(isBreakingNews),
      breaking: Boolean(breaking),
      location,
      photos: photoUrls,
    });
    
    console.log(`Created event with ${photoUrls.length} photos:`, photoUrls);
    
    // Notify all users about new event or breaking news
    try {
      const allUsers = await User.find({}, '_id');
      const userIds = allUsers.map(u => u._id);
      
      const isBreaking = Boolean(isBreakingNews || breaking);
      
      if (isBreaking) {
        // Breaking news notification with special formatting
        await createNotificationForUsers(
          userIds,
          'breaking',
          '🚨 Breaking News Alert',
          `${title}`,
          '/events',
          { eventId: event._id, isBreaking: true }
        );
      } else {
        // Regular event notification
        await createNotificationForUsers(
          userIds,
          'event',
          'New Event Published',
          `A new event "${title}" has been scheduled. Check it out!`,
          '/events',
          { eventId: event._id }
        );
      }
    } catch (notifError) {
      console.error('Error creating notifications:', notifError);
    }
    
    return res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    // Get existing event to track old photos for cleanup
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Handle photos - preserve existing ones and add new uploads
    let photoUrls = [];
    
    // Preserve existing photos from the request body
    if (Array.isArray(update.photos)) {
      photoUrls = update.photos.filter(photo => 
        typeof photo === 'string' && (photo.startsWith('/') || photo.startsWith('http'))
      );
    } else if (update.existingPhotos) {
      try {
        photoUrls = JSON.parse(update.existingPhotos);
      } catch {
        photoUrls = Array.isArray(update.existingPhotos) ? update.existingPhotos : [];
      }
    }
    
    // Handle new uploaded photo files from multipart form
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => `/uploads/events/${file.filename}`);
      photoUrls = [...photoUrls, ...uploadedUrls];
    }
    
    // Clean up removed photos
    const removedPhotos = existingEvent.photos.filter(oldPhoto => !photoUrls.includes(oldPhoto));
    removedPhotos.forEach(photoUrl => {
      if (photoUrl.startsWith('/uploads/events/')) {
        const filepath = path.join(__dirname, '..', photoUrl);
        try {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            console.log(`Deleted removed photo: ${filepath}`);
          }
        } catch (err) {
          console.error(`Error deleting photo ${filepath}:`, err);
        }
      }
    });
    
    update.photos = photoUrls;
    delete update.existingPhotos;
    
    console.log(`Updating event ${id} with ${photoUrls.length} photos:`, photoUrls);
    
    const event = await Event.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Clean up all associated photo files
    if (event.photos && event.photos.length > 0) {
      event.photos.forEach(photoUrl => {
        if (photoUrl.startsWith('/uploads/events/')) {
          const filepath = path.join(__dirname, '..', photoUrl);
          try {
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
              console.log(`Deleted event photo: ${filepath}`);
            }
          } catch (err) {
            console.error(`Error deleting photo ${filepath}:`, err);
          }
        }
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
