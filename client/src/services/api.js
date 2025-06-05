import axios from 'axios';
import { store } from '../app/store'; // Import the Redux store

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

export default api;