import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getWishlist);

router.route('/add')
    .post(addToWishlist);

router.route('/remove/:productId')
    .delete(removeFromWishlist);

export default router;