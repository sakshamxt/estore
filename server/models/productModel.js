import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  richDescription: {
    type: String,
    default: '',
  },
  images: [{
    type: String, // Cloudinary URLs
    required: true,
  }],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    default: 0,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product must belong to a category'],
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  user: { // The admin who created the product
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

// Pre-save hook to generate slug
productSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;