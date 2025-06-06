import api from './api';

const API_URL = '/wishlist';

const getWishlist = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const addItemToWishlist = async (productId) => {
  const response = await api.post(API_URL, { productId });
  return response.data;
};

const removeItemFromWishlist = async (productId) => {
  const response = await api.delete(`${API_URL}/${productId}`);
  return response.data;
};

const wishlistService = {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
};

export default wishlistService;