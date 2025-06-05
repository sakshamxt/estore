import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data.data) {
    // Assuming the token is in response.data.data.accessToken
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