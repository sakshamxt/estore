import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
  
  // Decrease stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.quantity;
      await product.save();
    }
  }

  const createdOrder = await order.save();
  
  // If payment method is Razorpay, create a Razorpay order
  if (paymentMethod === 'Razorpay') {
    const options = {
      amount: totalPrice * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: createdOrder._id.toString(),
    };
    try {
      const razorpayOrder = await razorpay.orders.create(options);
      createdOrder.razorpayOrderId = razorpayOrder.id;
      await createdOrder.save();
      
      res.status(201).json({
        message: 'Order created. Proceed to payment.',
        order: createdOrder,
        razorpayOrder
      });
    } catch (error) {
      res.status(500);
      throw new Error('Razorpay order creation failed: ' + error.message);
    }
  } else { // For COD
    res.status(201).json({
        message: 'Order created successfully (COD).',
        order: createdOrder
    });
  }
});


// @desc    Verify Razorpay payment and update order
// @route   POST /api/orders/razorpay/verify-payment
// @access  Private
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.orderStatus = 'Processing';
        order.paymentResult = {
            id: razorpay_payment_id,
            status: 'success',
            update_time: new Date().toISOString(),
            email_address: req.user.email, // Or from payment response if available
        };

        const updatedOrder = await order.save();
        res.json({ message: "Payment successful", order: updatedOrder });
    } else {
        res.status(400);
        throw new Error('Payment verification failed. Invalid signature.');
    }
});


// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order && (order.user._id.equals(req.user._id) || req.user.role === 'admin')) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// ADMIN Controllers

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
});


// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { status } = req.body;

  if (order) {
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});