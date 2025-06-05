import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const registerValidator = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validatorMiddleware,
];