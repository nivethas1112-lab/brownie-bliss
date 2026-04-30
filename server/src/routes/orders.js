import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.route('/')
  .get(getAllOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);

router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/cancel', cancelOrder);

export default router;
