import { Router } from 'express';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
} from '../controllers/cartController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addCartItem);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.post('/apply-coupon', applyCoupon);

export default router;
