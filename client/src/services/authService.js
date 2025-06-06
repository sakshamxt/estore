import api from './api'; // Use the centralized api instance

const API_URL = '/users/'; // The base URL is already in the api instance

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


const verifyOtp = async (otpData) => {
  // otpData is expected to be { email, otp }
  const response = await api.post(API_URL + 'verify-otp', otpData);
  // On successful verification, the backend should return the user and token
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
  verifyOtp
};

export default authService;