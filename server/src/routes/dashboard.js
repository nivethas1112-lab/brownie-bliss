import { Router } from 'express';
import {
  getDashboardStats,
  getRecentOrders,
  getSalesData,
} from '../controllers/dashboardController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/stats', getDashboardStats);
router.get('/recent-orders', getRecentOrders);
router.get('/sales', getSalesData);

export default router;
