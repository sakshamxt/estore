import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
  },
  minPurchaseAmount: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: null, // null means unlimited
  },
  usesCount: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Pre-save hook to convert code to uppercase
couponSchema.pre('save', function (next) {
  this.code = this.code.toUpperCase();
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;