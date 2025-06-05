import asyncHandler from 'express-async-handler';
import Wishlist from '../models/wishlistModel.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  if (wishlist) {
    res.json(wishlist);
  } else {
    // If no wishlist, return an empty one
    res.json({ user: req.user._id, products: [] });
  }
});


// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { products: productId } }, // $addToSet prevents duplicates
    { upsert: true, new: true } // upsert:true creates if it doesn't exist
  );
  res.status(200).json(wishlist);
});


// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: productId } }, // $pull removes the item
    { new: true }
  );
  if (wishlist) {
    res.json(wishlist);
  } else {
    res.status(404);
    throw new Error('Wishlist not found');
  }
});