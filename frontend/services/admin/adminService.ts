/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@/types/user';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Function to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('🔍 Retrieved Token from localStorage:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });

    console.log('🔍 API Response:', response.data); // ✅ Debugging Log

    return response.data.map((user: User) => ({
      ...user,
      sellerProfile: user.sellerProfile || { isApproved: false }, // ✅ Default to prevent undefined errors
    }));
  } catch (error) {
    console.error('🚨 Fetch Users Error:', error);
    throw new Error('Failed to fetch users');
  }
};

// Approve a seller
export const approveSeller = async (sellerId: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/sellers/approve/${sellerId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to approve seller');
  }
};

// Reject (delete) a seller
export const rejectSeller = async (sellerId: string) => {
  try {
    await axios.delete(`${API_URL}/admin/sellers/reject/${sellerId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw new Error('Failed to reject seller');
  }
};

// Delete a user
export const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};
