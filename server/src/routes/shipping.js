import { Router } from 'express';
import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from '../controllers/shippingController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/zones', getShippingZones);
router.post('/zones', createShippingZone);
router.put('/zones/:id', updateShippingZone);
router.delete('/zones/:id', deleteShippingZone);

export default router;
