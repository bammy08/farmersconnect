/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  completeSellerProfile,
  getSellerProfile,
  updateSellerProfile,
} from '@/services/seller/sellerService';

// ✅ Define Seller Data Type
interface SellerData {
  businessName: string;
  businessAddress: string;
  phone: string;
  state: string;
  lga: string;
}

// ✅ Define Slice State Type
interface SellerState {
  seller: SellerData | null;
  loading: boolean;
  error: string | null;
}

// ✅ Initial State
const initialState: SellerState = {
  seller: null,
  loading: false,
  error: null,
};

// ✅ Fetch Seller Profile
export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchProfile',
  async (token: string, { rejectWithValue }) => {
    try {
      return await getSellerProfile(token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching profile'
      );
    }
  }
);

// ✅ Complete Seller Profile (Onboarding)
export const completeSellerOnboarding = createAsyncThunk(
  'seller/completeOnboarding',
  async (
    { token, data }: { token: string; data: SellerData },
    { rejectWithValue }
  ) => {
    try {
      return await completeSellerProfile(token, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error completing onboarding'
      );
    }
  }
);

// ✅ Update Seller Profile
export const updateSellerData = createAsyncThunk(
  'seller/updateProfile',
  async (
    { token, data }: { token: string; data: SellerData },
    { rejectWithValue }
  ) => {
    try {
      return await updateSellerProfile(token, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error updating profile'
      );
    }
  }
);

// ✅ Seller Slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    resetSellerState: (state) => {
      state.seller = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟢 Fetch Profile
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟢 Complete Onboarding
      .addCase(completeSellerOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeSellerOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(completeSellerOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟢 Update Profile
      .addCase(updateSellerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerData.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
      })
      .addCase(updateSellerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Export Actions & Reducer
export const { resetSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
