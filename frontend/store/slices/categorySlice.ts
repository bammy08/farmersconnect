/* eslint-disable @typescript-eslint/no-explicit-any */
import { categoryService } from '@/services/category/categoryService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CategoryState {
  categories: { _id: string; name: string; image?: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async () => {
    return await categoryService.getCategories();
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (
    { categoryData, token }: { categoryData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await categoryService.createCategory(categoryData, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async (
    {
      id,
      categoryData,
      token,
    }: { id: string; categoryData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await categoryService.updateCategory(id, categoryData, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id, token);
      return id; // Return deleted category ID
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category'
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
