import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } from '../../controllers/couponController.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/')
    .post(createCoupon)
    .get(getAllCoupons);

router.route('/:id')
    .put(updateCoupon)
    .delete(deleteCoupon);

export default router;