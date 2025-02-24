import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: true, // Start as loading
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;

      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    loadUserFromStorage: (state) => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          state.token = token;
          state.user = JSON.parse(storedUser);
          state.isAuthenticated = true;
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('user'); // Remove corrupted data
      } finally {
        state.loading = false; // Stop loading after checking storage
      }
    },
  },
});

export const { login, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
