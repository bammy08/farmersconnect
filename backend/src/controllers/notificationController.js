import Notification from '../models/Notification.js';
import User from '../models/User.js';

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
 * Create a new notification
 */
export const createNotification = async (req, res) => {
  try {
    const { recipient, message, type } = req.body;

    if (!recipient || !message || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const notification = new Notification({
      recipient,
      message,
      type,
    });

    await notification.save();

    // ✅ Emit real-time notification (for online users)
    const recipientSocket = req.io?.onlineUsers?.get(recipient);
    if (recipientSocket) {
      req.io.to(recipientSocket).emit('receiveNotification', notification);
      console.log(`📢 Real-time notification sent to ${recipient}`);
    } else {
      // 🔥 Check user email preferences before sending an email
      const user = await User.findById(recipient);
      if (user?.email && user?.emailNotifications) {
        console.log(
          `📧 Sending email to ${user.email} with message: "${message}"`
        );
        const emailSent = await sendNotificationEmail(user.email, message);

        if (emailSent) {
          console.log('✅ Email sent successfully');
        } else {
          console.log('❌ Failed to send email');
        }
      } else {
        console.log(`❌ User ${recipient} has email notifications disabled`);
      }
    }

    return res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Create Notification Error:', error);
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
      { $set: { seen: true } } // ✅ Fixed update query
    );

    return res.json({ message: 'Notifications marked as seen' });
  } catch (error) {
    console.error('Mark Notifications Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user.id },
      { seen: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark Single Notification Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
