import api from './api';

const API_URL = '/orders';

// Create a new order
const createOrder = async (orderData) => {
  // orderData should be { shippingAddressId, paymentMethod }
  const response = await api.post(API_URL, orderData);
  return response.data;
};

const getMyOrders = async () => {
  const response = await api.get(`${API_URL}/my`);
  return response.data;
};

// Verify a payment
const verifyPayment = async (verificationData) => {
  // verificationData: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  const response = await api.post(`${API_URL}/verify-payment`, verificationData);
  return response.data;
};

const orderService = {
  createOrder,
  verifyPayment,
  getMyOrders
};

export default orderService;