import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// ADMIN Controllers

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
});


// @desc    Get all categories for admin
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});


// @desc    Get single category by ID
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});


// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = name;
    category.description = description;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});


// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    // Optional: Check if any product is using this category before deleting
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      res.status(400);
      throw new Error('Cannot delete category with associated products.');
    }
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});


// PUBLIC Controllers

// @desc    Get all public categories
// @route   GET /api/categories
// @access  Public
export const getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}, 'name slug'); // Only send name and slug
  res.json(categories);
});


// @desc    Get products by category slug
// @route   GET /api/categories/:slug
// @access  Public
export const getProductsByCategorySlug = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    const products = await Product.find({ category: category._id });
    res.json({ category: category.name, products });
});