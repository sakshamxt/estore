import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import { getAllOrders, updateOrderStatus } from '../../controllers/orderController.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/')
    .get(getAllOrders);

router.route('/:id/status')
    .put(updateOrderStatus);

export default router;