import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';

/**
 * Send a chat message between users
 */
export const sendChatMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user.id; // Authenticated user

    if (!receiver || !content) {
      return res
        .status(400)
        .json({ message: 'Receiver and content are required' });
    }

    // Create a new chat message
    const chat = await Chat.create({ sender, receiver, content });

    // Create a notification for the receiver
    await Notification.create({
      recipient: receiver,
      sender,
      type: 'chat',
      message: `New message from ${req.user.name}`,
    });

    // Emit real-time event (Socket.io)
    req.io.to(receiver).emit('newChatMessage', chat);

    return res.status(201).json(chat);
  } catch (error) {
    console.error('Send Chat Message Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Get chat history between two users
 */
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user.id;

    const chats = await Chat.find({
      $or: [
        { sender: currentUser, receiver: userId },
        { sender: userId, receiver: currentUser },
      ],
    }).sort({ createdAt: 1 });

    return res.json(chats);
  } catch (error) {
    console.error('Chat History Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Mark chat messages as seen
 */
export const markChatsAsSeen = async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.user.id;

    await Chat.updateMany(
      { sender: senderId, receiver: receiverId, seen: false },
      { seen: true }
    );

    return res.json({ message: 'Chats marked as seen' });
  } catch (error) {
    console.error('Mark Seen Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
