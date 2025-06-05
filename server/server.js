import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});