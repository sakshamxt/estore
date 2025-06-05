import express from 'express';
import { protect, authorize } from '../../middlewares/authMiddleware.js';
import { uploadMultipleImages } from '../../middlewares/multer.js';
import { createProduct, updateProduct, deleteProduct } from '../../controllers/productController.js';
import { productValidator } from '../../utils/validators/productValidator.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.post('/', uploadMultipleImages, productValidator, createProduct);

router.route('/:id')
  .put(uploadMultipleImages, productValidator, updateProduct)
  .delete(deleteProduct);

export default router;