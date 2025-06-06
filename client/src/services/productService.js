import api from './api';

// Fetch products with optional query parameters
// Example: getProducts({ page: 1, limit: 10, sortBy: 'price', order: 'asc' })
const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// Fetch a single product by its ID
const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
}

const addReview = async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
}

const productService = {
  getProducts,
  getProductBySlug,
  addReview
};

export default productService;