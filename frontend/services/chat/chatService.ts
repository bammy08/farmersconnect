import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const chatService = {
  // ✅ Fetch chat history for a user
  async fetchChats(userId: string, token: string) {
    console.log('Fetching chats for user:', userId);
    const res = await axios.get(`${API_URL}/chats/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetched chats:', res.data); // ✅ Log API response
    return res.data;
  },

  // ✅ Send a new message (Fixed payload)
  async sendMessage(receiver: string, content: string, token: string) {
    console.log('Sending message to:', receiver, 'Content:', content);
    const res = await axios.post(
      `${API_URL}/chats`, // ✅ Correct route
      { receiver, content }, // ✅ Fixed payload
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  // ✅ Mark messages as seen
  async markChatsAsSeen(senderId: string, token: string) {
    console.log('Marking messages from', senderId, 'as seen');
    const res = await axios.put(
      `${API_URL}/chats/seen`,
      { senderId }, // Ensure senderId is sent in the request body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
};
