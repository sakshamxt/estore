import api from './api'; // Use the centralized api instance

const API_URL = '/auth/'; // The base URL is already in the api instance

// Register user
const register = async (userData) => {
  const response = await api.post(API_URL + 'register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(API_URL + 'login', userData);
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;