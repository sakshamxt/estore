import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  // Optional: Check if the user has purchased the product
  // This would require checking the Order model. For now, we'll allow any logged-in user to review.

  const review = await Review.create({
    rating,
    comment,
    product: productId,
    user: req.user._id,
  });

  res.status(201).json({ message: 'Review added', review });
});


// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
  res.json(reviews);
});