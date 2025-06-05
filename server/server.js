import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import adminCategoryRoutes from './routes/admin/categoryRoutes.js';
import adminProductRoutes from './routes/admin/productRoutes.js';
import publicCategoryRoutes from './routes/public/categoryRoutes.js';
import publicProductRoutes from './routes/public/productRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route for testing
app.get('/', (req, res) => {
  res.send('eStore API is running...');
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);

// Public routes
app.use('/api/categories', publicCategoryRoutes);
app.use('/api/products', publicProductRoutes);

// Admin routes
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/products', adminProductRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});