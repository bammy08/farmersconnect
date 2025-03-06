import express from 'express';
import {
  getNotifications,
  markNotificationsAsSeen,
  createNotification,
  markNotificationAsRead, // Add this
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications); // Get notifications
router.put('/seen', protect, markNotificationsAsSeen); // Mark notifications as seen
router.post('/', protect, createNotification); // ✅ Create a new notification
router.put('/:id/read', protect, markNotificationAsRead); // ✅ Mark a single notification as read

export default router;
