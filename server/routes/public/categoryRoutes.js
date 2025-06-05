import express from 'express';
import { getPublicCategories, getProductsByCategorySlug } from '../../controllers/categoryController.js';

const router = express.Router();

router.get('/', getPublicCategories);
router.get('/:slug', getProductsByCategorySlug);

export default router;