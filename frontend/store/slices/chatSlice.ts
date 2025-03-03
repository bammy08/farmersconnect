/* eslint-disable @typescript-eslint/no-explicit-any */
import { chatService } from '@/services/chat/chatService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type ChatMessage = {
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string;
};

interface ChatState {
  chats: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (token: string, { rejectWithValue }) => {
    try {
      return await chatService.fetchChats(token);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chats');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    {
      recipientId,
      message,
      token,
    }: { recipientId: string; message: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await chatService.sendMessage(recipientId, message, token);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
