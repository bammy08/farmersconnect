import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Send a chat message between users
 */
export const sendChatMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const senderId = req.user.id; // Authenticated user

    if (!receiver || !content) {
      return res
        .status(400)
        .json({ message: 'Receiver and content are required' });
    }

    // Get sender's name
    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Create a new chat message with timestamp
    const chat = await Chat.create({
      sender: senderId,
      senderName: senderUser.name, // ✅ Add sender's name
      receiver,
      content,
      createdAt: new Date(), // ✅ Ensure timestamp
    });

    // Create a notification for the receiver
    await Notification.create({
      recipient: receiver,
      sender: senderId,
      type: 'chat',
      message: `New message from ${senderUser.name}`,
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
 * Get chat history between two users (populating sender's name)
 */
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Seller's ID
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email') // ✅ Fetch sender's name
      .populate('receiver', 'name email'); // ✅ Fetch receiver's name (optional)

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
