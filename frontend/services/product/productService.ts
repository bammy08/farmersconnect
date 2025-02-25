import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const productService = {
  async getCategories() {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },
  async getProducts(token?: string) {
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.get(`${API_URL}/products`, { headers });

      // Ensure the response structure matches expectations
      if (response?.data) {
        return response.data; // Should be { success: boolean, products: array }
      } else {
        console.error('❌ Unexpected API response format:', response);
        return null;
      }
    } catch {
      console.error('❌ Error fetching products:');
    }
  },

  async getProductById(productId: string) {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      console.log('📦 API Response:', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      return null; // Handle errors gracefully
    }
  },

  async createProduct(productData: FormData, token: string) {
    const response = await axios.post(
      `${API_URL}/products/create`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async updateProduct(productId: string, updatedData: FormData, token: string) {
    const response = await axios.put(
      `${API_URL}/products/${productId}`,
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

  async deleteProduct(productId: string, token: string) {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
