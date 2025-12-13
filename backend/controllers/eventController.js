const Event = require('../models/eventModel');
const { createNotificationForUsers } = require('./notificationController');
const User = require('../models/userModel');

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

    const event = await Event.create({
      title,
      description,
      date,
      isBreakingNews: Boolean(isBreakingNews),
      breaking: Boolean(breaking),
      location,
      photos: Array.isArray(photos) ? photos : [],
    });
    
    // Notify all users about new event or breaking news
    try {
      const allUsers = await User.find({}, '_id');
      const userIds = allUsers.map(u => u._id);
      
      const isBreaking = Boolean(isBreakingNews || breaking);
      const notificationTitle = isBreaking ? '🚨 Breaking News Alert' : 'New Event Published';
      const notificationMessage = isBreaking 
        ? `Breaking News: "${title}" - ${description}`
        : `A new event "${title}" has been scheduled. Check it out!`;
      
      await createNotificationForUsers(
        userIds,
        isBreaking ? 'breaking' : 'event',
        notificationTitle,
        notificationMessage,
        '/events',
        { eventId: event._id }
      );
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
  if (update.photos && !Array.isArray(update.photos)) update.photos = [];
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
