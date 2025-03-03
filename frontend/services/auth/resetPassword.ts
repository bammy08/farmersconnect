/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/api';

export const forgotPassword = async (email: string) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const res = await api.post(`/auth/reset-password/${token}`, { password }); // ✅ Token in URL
    return res.data;
  } catch (error: any) {
    console.error('Reset Password API Error:', error.response?.data); // ✅ Log backend error
    throw error;
  }
};
