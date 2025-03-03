import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const notificationService = {
  async fetchNotifications(token: string) {
    const res = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async markAsRead(notificationId: string, token: string) {
    const res = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};
