import { configureStore } from '@reduxjs/toolkit';

// Import the raw api instance and the loading middleware
import api from '../services/api';
import { rtkLoadingMiddleware } from './rtkLoadingMiddleware';

// Import all reducers and the specific logout action for the interceptor
import authReducer, { logout } from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import userReducer from '../features/user/userSlice';
import orderReducer from '../features/order/orderSlice';


// 1. Create the Redux store
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


/**
 * Sets up Axios interceptors by injecting the Redux store.
 * This avoids circular dependencies that can occur when importing the store directly into the api service file.
 * @param {object} store - The created Redux store.
 */
const setupInterceptors = (store) => {
  // Request interceptor to attach the JWT token to every outgoing request
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.user?.accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle global errors, like 401 Unauthorized
  api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
      // Check if the error is a 401 Unauthorized response
      if (error.response?.status === 401) {
        // Dispatch the logout action to clear user session and redirect
        console.log("Interceptor: Unauthorized access. Logging out.");
        store.dispatch(logout());
      }
      // Return the error to be handled by the component's catch block
      return Promise.reject(error);
    }
  );
};

// 2. Call the setup function with the newly created store
setupInterceptors(store);