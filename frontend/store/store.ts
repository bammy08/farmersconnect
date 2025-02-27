import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loadUserFromStorage } from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import sellerReducer from './slices/sellerSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    products: productReducer,
    seller: sellerReducer,
    search: searchReducer,
  },
});

store.dispatch(loadUserFromStorage());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
