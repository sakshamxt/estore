import api from './api';

const API_URL = '/addresses';

// Get all addresses for the current user
const getAddresses = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Add a new address
const addAddress = async (addressData) => {
  const response = await api.post(API_URL, addressData);
  return response.data;
};


const deleteAddress = async (addressId) => {
  const response = await api.delete(`${API_URL}/${addressId}`);
  return response.data;
};

const userService = {
  getAddresses,
  addAddress,
  deleteAddress
};

export default userService;