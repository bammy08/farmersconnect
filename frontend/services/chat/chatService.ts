import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const chatService = {
  async fetchChats(token: string) {
    const res = await axios.get(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async sendMessage(recipientId: string, message: string, token: string) {
    const res = await axios.post(
      `${API_URL}/chats/send`,
      { recipientId, message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  async fetchMessages(chatId: string, token: string) {
    const res = await axios.get(`${API_URL}/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
