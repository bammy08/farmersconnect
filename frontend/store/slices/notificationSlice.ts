/* eslint-disable @typescript-eslint/no-explicit-any */
import { notificationService } from '@/services/notification/notificationService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type Notification = {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (token: string, { rejectWithValue }) => {
    try {
      return await notificationService.fetchNotifications(token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch notifications'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: { payload: Notification }) => {
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
