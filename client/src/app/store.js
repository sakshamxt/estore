import { configureStore } from '@reduxjs/toolkit';

// Middleware
import { rtkLoadingMiddleware } from './rtkLoadingMiddleware';

import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import userReducer from '../features/user/userSlice';

import cartReducer from '../features/cart/cartSlice';

import orderReducer from '../features/order/orderSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkLoadingMiddleware),
});