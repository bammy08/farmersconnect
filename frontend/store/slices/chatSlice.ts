/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { chatService } from '@/services/chat/chatService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type ChatMessage = {
  _id: string; // Unique message ID from the database
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string; // Ensure every message has a timestamp
  seen?: boolean; // Track if the message has been read
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

// ✅ Fetch chat history between the current user and another user
export const fetchChats = createAsyncThunk<
  ChatMessage[],
  { userId: string; token: string }
>('chat/fetchChats', async ({ userId, token }, { rejectWithValue }) => {
  try {
    const response = await chatService.fetchChats(userId, token);
    return response.length > 0 ? response : []; // Ensure correct state updates
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch chats'
    );
  }
});

// ✅ Send a new message
export const sendMessage = createAsyncThunk<
  ChatMessage,
  { receiver: string; content: string; token: string },
  { rejectValue: string }
>(
  'chat/sendMessage',
  async ({ receiver, content, token }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(receiver, content, token);
      return {
        ...response,
        timestamp: response.timestamp || new Date().toISOString(), // Ensure a valid timestamp
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

// ✅ Mark messages as seen
export const markChatsAsSeen = createAsyncThunk<
  void,
  { senderId: string; token: string },
  { rejectValue: string }
>('chat/markChatsAsSeen', async ({ senderId, token }, { rejectWithValue }) => {
  try {
    await chatService.markChatsAsSeen(senderId, token);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to mark chats as seen'
    );
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ✅ Add new message from real-time socket events, preventing duplicates
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const isDuplicate = state.chats.some(
        (msg) => msg._id === action.payload._id
      );
      if (!isDuplicate) {
        state.chats.push(action.payload);
      }
    },

    // ✅ Mark messages as seen in state
    updateSeenStatus: (state, action: PayloadAction<{ senderId: string }>) => {
      state.chats = state.chats.map((msg) =>
        msg.sender === action.payload.senderId ? { ...msg, seen: true } : msg
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ Fetching chat history
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Sending a message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const isDuplicate = state.chats.some(
          (msg) => msg._id === action.payload._id
        );
        if (!isDuplicate) {
          state.chats.push(action.payload);
        }
      })

      // ✅ Marking messages as seen
      .addCase(markChatsAsSeen.fulfilled, (state, action) => {
        state.chats = state.chats.map((msg) => ({ ...msg, seen: true }));
      });
  },
});

export const { addMessage, updateSeenStatus } = chatSlice.actions;
export default chatSlice.reducer;
