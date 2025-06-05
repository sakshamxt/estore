import express from 'express';
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All these routes are protected
router.use(protect);

router.route('/').post(addAddress).get(getAddresses);
router.route('/:id').put(updateAddress).delete(deleteAddress);
router.put('/:id/default', setDefaultAddress);

export default router;