/* eslint-disable @typescript-eslint/no-explicit-any */
import { login } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store/store';
import axios from 'axios';

export const loginUser = async (
  email: string,
  password: string,
  dispatch: AppDispatch
) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    // ✅ Log the entire response to check if the token exists
    console.log('Login Response:', res.data);

    const { token, user } = res.data;

    if (!user) {
      throw new Error('Invalid response: User data missing.');
    }

    // ✅ Log token and user data separately
    console.log('Received Token:', token);
    console.log('Logged-in User:', user);

    // ✅ Save token to localStorage
    localStorage.setItem('token', token);

    // ✅ Dispatch login action
    dispatch(
      login({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          _id: '',
        },
      })
    );

    return { success: true };
  } catch (error: any) {
    console.error('Login Error:', error);

    return {
      success: false,
      message:
        error.response?.data?.message || 'Login failed. Please try again.',
    };
  }
};
