/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchProducts } from '@/services/search/searchService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SearchState {
  results: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
};

// Async thunk for fetching search results
export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      return await searchProducts(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
