import { Router } from 'express';
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.route('/')
  .get(getAllCoupons)
  .post(createCoupon);

router.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

router.post('/validate', validateCoupon);

export default router;
