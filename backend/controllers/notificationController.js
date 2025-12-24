const Notification = require('../models/notificationModel');

// Helper function to create notification
const createNotification = async (userId, type, title, message, link = null, metadata = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      metadata,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Bulk create notifications for multiple users
const createNotificationForUsers = async (userIds, type, title, message, link = null, metadata = null) => {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      link,
      metadata,
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { unread } = req.query;
    const filter = { userId: req.user.id };
    if (unread === 'true') {
      filter.read = false;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 notifications
    
    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });
    return res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    return res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotification,
  createNotificationForUsers,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
