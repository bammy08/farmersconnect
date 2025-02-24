import axios from 'axios';

// Ensure the API URL is correctly formatted
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ''); // Remove trailing slash if any
const API_URL = `${API_BASE_URL}/sellers`; // Ensures no double '/api/api/'

/**
 * Fetch seller profile
 * @param token - The authentication token
 */
export const getSellerProfile = async (token: string) => {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Complete seller onboarding
 * @param token - The authentication token
 * @param sellerData - Seller profile data
 */
export const completeSellerProfile = async (
  token: string,
  sellerData: {
    businessName: string;
    businessAddress: string;
    phone: string;
    state: string;
    lga: string;
  }
) => {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  console.log('Sending Token:', token); // ✅ Log token before sending

  const response = await axios.post(`${API_URL}/onboarding`, sellerData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

/**
 * Update seller profile
 * @param token - The authentication token
 * @param updatedData - New seller profile data
 */
export const updateSellerProfile = async (
  token: string,
  updatedData: {
    businessName?: string;
    businessAddress?: string;
    phone?: string;
    state?: string;
    lga?: string;
  }
) => {
  if (!token) {
    throw new Error('No authentication token provided');
  }

  console.log('Updating Profile with Data:', updatedData); // ✅ Log updated data before sending

  const response = await axios.put(`${API_URL}/profile`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
