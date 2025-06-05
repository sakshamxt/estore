import api from './api';

// Fetch products with optional query parameters
// Example: getProducts({ page: 1, limit: 10, sortBy: 'price', order: 'asc' })
const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// Fetch a single product by its ID
const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

const productService = {
  getProducts,
  getProductById,
};

export default productService;