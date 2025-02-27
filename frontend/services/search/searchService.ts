import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const searchProducts = async (
  params: Record<string, string | number>
) => {
  const response = await axios.get(`${API_URL}/search`, { params }); // Pass params correctly
  return response.data;
};
