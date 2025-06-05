import express from 'express';
import { getProducts, getProductBySlug, getRelatedProducts } from '../../controllers/productController.js';
import { createReview, getProductReviews } from '../../controllers/reviewController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { reviewValidator } from '../../utils/validators/reviewValidator.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

router.route('/:id/reviews')
  .post(protect, reviewValidator, createReview)
  .get(getProductReviews);

export default router;