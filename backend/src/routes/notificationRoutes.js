import express from 'express';
import {
  getNotifications,
  markNotificationsAsSeen,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications); // Get notifications
router.put('/seen', protect, markNotificationsAsSeen); // Mark notifications as seen

export default router;
