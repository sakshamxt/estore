import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const reviewValidator = [
  check('rating')
    .notEmpty().withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  check('comment')
    .notEmpty().withMessage('Comment is required'),
  validatorMiddleware,
];