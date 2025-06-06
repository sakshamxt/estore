import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';

// ADMIN Controllers

// @desc    Create a new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minPurchaseAmount, maxUses, expiryDate } = req.body;
  const coupon = await Coupon.create({ code, discountType, discountValue, minPurchaseAmount, maxUses, expiryDate });
  res.status(201).json(coupon);
});


// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});


// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.json(coupon);
});


// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});


// PUBLIC Controller

// @desc    Apply a coupon
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;
  
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  // Validations
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found.');
  }
  if (!coupon.isActive) {
    res.status(400);
    throw new Error('This coupon is currently inactive.');
  }
  if (coupon.expiryDate < new Date()) {
    res.status(400);
    throw new Error('This coupon has expired.');
  }
  if (coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses) {
    res.status(400);
    throw new Error('This coupon has reached its usage limit.');
  }
  if (cartTotal < coupon.minPurchaseAmount) {
    res.status(400);
    throw new Error(`Minimum purchase of ₹${coupon.minPurchaseAmount} is required.`);
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'fixed') {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === 'percentage') {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
  }
  
  res.json({
    message: 'Coupon applied successfully!',
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    finalPrice: parseFloat((cartTotal - discountAmount).toFixed(2))
  });
});