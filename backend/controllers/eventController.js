const Event = require('../models/eventModel');
const { createNotificationForUsers } = require('./notificationController');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Helper function to ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads/events');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

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
    const { title, description, date, isBreakingNews, breaking, location, photos } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description, and date are required' });
    }

    // Handle uploaded photo files and base64 photos
    let photoUrls = [];
    
    // Process photos array if provided (from frontend form with base64)
    if (Array.isArray(photos)) {
      const uploadsDir = ensureUploadsDir();
      for (const photo of photos) {
        // If it's a data URL (base64), convert it to a file
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          try {
            // Convert base64 to buffer
            const base64Data = photo.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Generate unique filename
            const filename = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpeg`;
            const filepath = path.join(uploadsDir, filename);
            
            // Save file
            fs.writeFileSync(filepath, buffer);
            console.log(`Saved event photo: ${filepath}`);
            
            photoUrls.push(`/uploads/events/${filename}`);
          } catch (err) {
            console.error('Error converting base64 to file:', err);
          }
        }
      }
    }
    
    // Handle uploaded photo files from multipart form
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => `/uploads/events/${file.filename}`);
      photoUrls = [...photoUrls, ...uploadedUrls];
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
    
    // Handle photos - convert base64 to files if needed
    let photoUrls = [];
    
    // If photos array is provided (from frontend form), process them
    if (Array.isArray(update.photos)) {
      const uploadsDir = ensureUploadsDir();
      for (const photo of update.photos) {
        // If it's a data URL (base64), convert it to a file
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          try {
            // Convert base64 to buffer
            const base64Data = photo.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Generate unique filename
            const filename = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpeg`;
            const filepath = path.join(uploadsDir, filename);
            
            // Save file
            fs.writeFileSync(filepath, buffer);
            console.log(`Saved event photo on update: ${filepath}`);
            
            photoUrls.push(`/uploads/events/${filename}`);
          } catch (err) {
            console.error('Error converting base64 to file:', err);
            // If conversion fails, keep original if it's a valid path
            if (photo.startsWith('/')) {
              photoUrls.push(photo);
            }
          }
        } else if (typeof photo === 'string' && !photo.startsWith('http')) {
          // Existing relative paths
          photoUrls.push(photo);
        } else if (typeof photo === 'string' && photo.startsWith('http')) {
          // External URLs
          photoUrls.push(photo);
        }
      }
    } else if (update.existingPhotos) {
      // Handle legacy existingPhotos
      try {
        photoUrls = JSON.parse(update.existingPhotos);
      } catch {
        photoUrls = Array.isArray(update.existingPhotos) ? update.existingPhotos : [];
      }
    }
    
    // Handle new uploaded photo files
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => `/uploads/events/${file.filename}`);
      photoUrls = [...photoUrls, ...uploadedUrls];
    }
    
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

    return res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
