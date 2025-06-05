import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

// Pre-save hook to generate slug from name
categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;