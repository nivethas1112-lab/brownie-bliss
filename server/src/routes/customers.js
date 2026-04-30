import { Router } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.route('/')
  .get(getAllCustomers);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

export default router;
