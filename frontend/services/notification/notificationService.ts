import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const notificationService = {
  /**
   * Fetch notifications for the logged-in user
   */
  async fetchNotifications(token: string) {
    const res = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /**
   * Mark all notifications as seen
   */
  async markAllAsSeen(token: string) {
    const res = await axios.put(
      `${API_URL}/notifications/seen`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string, token: string) {
    const res = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  /**
   * Create a new notification (Admin or Seller)
   */
  async createNotification(
    recipientId: string,
    message: string,
    type: string,
    token: string
  ) {
    const res = await axios.post(
      `${API_URL}/notifications`,
      { recipientId, message, type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};
