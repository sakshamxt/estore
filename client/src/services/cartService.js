import api from './api';

const API_URL = '/cart';

// Get the current user's cart
const getCart = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Add an item to the cart
const addItemToCart = async (itemData) => {
  // itemData should be { productId, quantity }
  const response = await api.post(API_URL, itemData);
  return response.data;
};

// Update an item's quantity in the cart
const updateItemQuantity = async (productId, quantity) => {
  const response = await api.patch(`${API_URL}/${productId}`, { quantity });
  return response.data;
};

// Remove an item from the cart
const removeItemFromCart = async (productId) => {
  const response = await api.delete(`${API_URL}/${productId}`);
  return response.data;
};

const cartService = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
};

export default cartService;