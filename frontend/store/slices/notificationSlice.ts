/* eslint-disable @typescript-eslint/no-explicit-any */
import { notificationService } from '@/services/notification/notificationService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  _id: string;
  message: string;
  type: string;
  seen: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk<
  Notification[],
  string,
  { rejectValue: string }
>('notifications/fetchNotifications', async (token, { rejectWithValue }) => {
  try {
    return await notificationService.fetchNotifications(token);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch notifications'
    );
  }
});

export const markAllAsSeen = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('notifications/markAllAsSeen', async (token, { rejectWithValue }) => {
  try {
    await notificationService.markAllAsSeen(token);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to mark all as seen'
    );
  }
});

export const markAsRead = createAsyncThunk<
  string,
  { notificationId: string; token: string },
  { rejectValue: string }
>(
  'notifications/markAsRead',
  async ({ notificationId, token }, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId, token);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

export const notificationsSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload); // Add new notification at the top
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      .addCase(markAllAsSeen.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          seen: true,
        }));
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n._id === action.payload ? { ...n, seen: true } : n
        );
      });
  },
});

export const { addNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
