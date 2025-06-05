// import crypto from 'crypto';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/email.js';

// A simple async error handler wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
        name,
        email,
        password,
        otp,
        otpExpires,
    });

    try {
        await sendEmail({
            email: user.email,
            subject: 'eStore - Verify Your Email',
            message: `Hello ${user.name},\n\nYour One-Time Password (OTP) for eStore registration is: ${otp}\n\nThis OTP is valid for 10 minutes.\n`,
        });

        res.status(201).json({
            success: true,
            message: `An OTP has been sent to ${user.email}. Please verify to complete your registration.`,
        });
    } catch (error) {
        console.error(error);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent. Please try again.');
    }
});


// @desc    Verify user OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
        email, 
        otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid OTP or OTP has expired');
    }
    
    if (user.otp !== otp) {
        res.status(400);
        throw new Error('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = generateToken(user._id);

    res.status(200).json({
        message: 'Email verified successfully!',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token,
    });
});


// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            res.status(401);
            throw new Error('Email not verified. Please verify your email first.');
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is available from the protect middleware
    res.json(req.user);
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Add more fields to update as needed

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// ... (forgotPassword and resetPassword would follow a similar pattern to OTP verification)

export {
    registerUser,
    verifyOtp,
    loginUser,
    getUserProfile,
    updateUserProfile,
};