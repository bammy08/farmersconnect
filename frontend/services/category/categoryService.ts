import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const categoryService = {
  async getCategories() {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  async createCategory(categoryData: FormData, token: string) {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateCategory(
    categoryId: string,
    updatedData: FormData,
    token: string
  ) {
    const response = await axios.put(
      `${API_URL}/categories/${categoryId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async deleteCategory(categoryId: string, token: string) {
    const response = await axios.delete(`${API_URL}/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
