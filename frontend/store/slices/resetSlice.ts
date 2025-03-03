/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPassword, resetPassword } from '@/services/auth/resetPassword';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  successMessage: null,
};

// 📌 Forgot Password Async Action
export const forgotPasswordAction = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      return await forgotPassword(email);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

// 📌 Reset Password Async Action
export const resetPasswordAction = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await resetPassword(token, password);
    } catch (error: any) {
      console.error('Reset Password Error:', error.response);
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

const resetSlice = createSlice({
  name: 'reset',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = resetSlice.actions;
export default resetSlice.reducer;
