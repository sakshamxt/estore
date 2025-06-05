import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import { createCategory, getAdminCategories, getCategoryById, updateCategory, deleteCategory } from '../../controllers/categoryController.js';
import { categoryValidator } from '../../utils/validators/categoryValidator.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/')
  .post(categoryValidator, createCategory)
  .get(getAdminCategories);

router.route('/:id')
  .get(getCategoryById)
  .put(categoryValidator, updateCategory)
  .delete(deleteCategory);

export default router;