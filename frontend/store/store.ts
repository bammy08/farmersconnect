import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loadUserFromStorage } from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import sellerReducer from './slices/sellerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    products: productReducer,
    seller: sellerReducer,
  },
});

store.dispatch(loadUserFromStorage());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
