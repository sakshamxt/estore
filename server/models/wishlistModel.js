import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user has only one wishlist
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  }],
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;