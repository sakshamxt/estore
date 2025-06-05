import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const categoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3 })
    .withMessage('Category name must be at least 3 characters long'),
  check('description').optional().isString(),
  validatorMiddleware,
];