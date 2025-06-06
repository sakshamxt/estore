import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.user?.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred.';

    if (error.response?.status === 401) {
      // If token is expired or invalid, log the user out
      store.dispatch(logout());
      window.location.href = '/login'; // Redirect to login
      toast.error("Session expired. Please log in again.");
    } else {
      // For other errors, just show a generic error toast
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;