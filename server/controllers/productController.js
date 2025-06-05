import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import uploadFromBuffer from '../utils/cloudinary.js';

// ADMIN Controllers

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, richDescription, brand, price, category, countInStock, isFeatured } = req.body;
  
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No image files uploaded.');
  }

  // Upload images to Cloudinary
  const imageUrls = [];
  for (const file of req.files) {
    const result = await uploadFromBuffer(file.buffer, 'eStore/products');
    imageUrls.push(result.secure_url);
  }

  const product = new Product({
    name,
    description,
    richDescription,
    images: imageUrls,
    brand,
    price,
    category,
    countInStock,
    isFeatured,
    user: req.user._id, // from protect middleware
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, richDescription, brand, price, category, countInStock, isFeatured } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Handle image uploads if new images are provided
  let imageUrls = product.images;
  if (req.files && req.files.length > 0) {
    // Here you might want to add logic to delete old images from Cloudinary
    const newImageUrls = [];
    for (const file of req.files) {
      const result = await uploadFromBuffer(file.buffer, 'eStore/products');
      newImageUrls.push(result.secure_url);
    }
    imageUrls = newImageUrls; // Replace old images with new ones
  }

  product.name = name;
  product.description = description;
  product.richDescription = richDescription;
  product.brand = brand;
  product.price = price;
  product.category = category;
  product.countInStock = countInStock;
  product.isFeatured = isFeatured;
  product.images = imageUrls;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});


// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    // Add logic here to delete images from Cloudinary if needed
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// PUBLIC Controllers


// @desc    Fetch all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    // Filtering
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand ? { brand: { $in: req.query.brand.split(',') } } : {};
    const price = req.query.price ? { price: { $gte: Number(req.query.price.split('-')[0]), $lte: Number(req.query.price.split('-')[1]) } } : {};

    const filter = { ...keyword, ...category, ...brand, ...price };

    // Sorting
    let sort = {};
    if (req.query.sort === 'price-asc') sort.price = 1;
    else if (req.query.sort === 'price-desc') sort.price = -1;
    else if (req.query.sort === 'rating') sort.rating = -1;
    else sort.createdAt = -1; // Newest first

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});


// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name');
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id }, // Exclude the current product
  }).limit(5);

  res.json(relatedProducts);
});