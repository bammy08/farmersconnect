import Notification from '../models/Notification.js';

/**
 * Get notifications for the logged-in user
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Mark notifications as seen
 */
export const markNotificationsAsSeen = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, seen: false },
      { seen: true }
    );

    return res.json({ message: 'Notifications marked as seen' });
  } catch (error) {
    console.error('Mark Notifications Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
