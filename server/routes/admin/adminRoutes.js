import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import { getAllUsers, getUserById, updateUser, getDashboardStats } from '../../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('admin'));

// Dashboard Route
router.get('/dashboard/stats', getDashboardStats);

// User Management Routes
router.get('/users', getAllUsers);
router.route('/users/:id')
    .get(getUserById)
    .put(updateUser);

export default router;