import mongoose from 'mongoose';
import Product from './productModel.js';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Review comment cannot be empty'],
    trim: true,
  },
}, { timestamps: true });

// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: stats[0].avgRating.toFixed(1),
        numReviews: stats[0].numReviews,
      });
    } else {
      // If no reviews, reset to default
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.product);
});

// Call calculateAverageRating before remove (using pre hook for access to document)
reviewSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  // Pass the product ID to a custom property to access it in the post hook
  this.__productId = this.product;
  await this.constructor.calculateAverageRating(this.__productId);
  next();
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;