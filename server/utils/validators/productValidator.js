import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';
import Category from '../../models/categoryModel.js';

export const productValidator = [
  check('name').notEmpty().withMessage('Product name is required'),
  check('description').notEmpty().withMessage('Product description is required'),
  check('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number'),
  check('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID format')
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error('Category not found');
      }
    }),
  check('countInStock')
    .notEmpty().withMessage('Count in stock is required')
    .isNumeric().withMessage('Count in stock must be a number'),
  validatorMiddleware,
];