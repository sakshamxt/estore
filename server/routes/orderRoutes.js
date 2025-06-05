import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createOrder, verifyRazorpayPayment, getMyOrders, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createOrder);

router.route('/myorders')
    .get(getMyOrders);

router.route('/razorpay/verify-payment')
    .post(verifyRazorpayPayment);

// This should be the last route to avoid matching conflicts
router.route('/:id')
    .get(getOrderById);

export default router;