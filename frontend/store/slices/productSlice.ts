/* eslint-disable @typescript-eslint/no-explicit-any */
import { productService } from '@/services/product/productService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Product Type Definition
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  bulkPricing: {
    _id: number;
    minQuantity: number;
    price: number;
  }[];
  quantity: number;
  category: string;
  state: string;
  lga: string;
  images: string[];
  seller?:
    | {
        sellerProfile: string | boolean | undefined;
        _id: string;
        name?: string;
        email?: string;
      }
    | string;
  createdAt: string;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// 🚀 Async Thunks (Handles API Calls)

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ token }: { token?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(token);

      if (!response) {
        console.error('❌ API returned null or undefined');
        return rejectWithValue('Unexpected empty response from API');
      }

      if (Array.isArray(response.products)) {
        return response.products; // Expected structure
      } else {
        console.error('❌ Invalid API response format:', response);
        return rejectWithValue('Invalid API response format');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string) => {
    const response = await productService.getProductById(id);
    console.log('🎯 Redux API Response:', response);
    return response.product; // Ensure correct field
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (
    { productData, token }: { productData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await productService.createProduct(productData, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (
    {
      productId,
      updatedData,
      token,
    }: { productId: string; updatedData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await productService.updateProduct(productId, updatedData, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (
    { productId, token }: { productId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      await productService.deleteProduct(productId, token);
      return productId; // Return deleted product ID for state update
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

// 🔥 Product Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.product = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          if (!Array.isArray(action.payload)) {
            console.error('API did not return an array. Resetting products.');
            state.products = [];
          } else {
            state.products = action.payload;
          }
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.product = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.push(action.payload);
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products = state.products.map((product) =>
            product._id === action.payload._id ? action.payload : product
          );
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.products = state.products.filter(
            (product) => product._id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
