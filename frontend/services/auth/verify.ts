/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/auth/verify/${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Invalid or expired token.');
  }
};
