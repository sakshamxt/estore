import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice'; // Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer, // Add product reducer
  },
});