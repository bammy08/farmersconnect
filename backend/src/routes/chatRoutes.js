import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getChatHistory,
  markChatsAsSeen,
  sendChatMessage,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', protect, sendChatMessage); // Send a chat message
router.get('/history/:userId', protect, getChatHistory); // Fetch chat history
router.put('/seen', protect, markChatsAsSeen); // Mark chat messages as seen

export default router;
