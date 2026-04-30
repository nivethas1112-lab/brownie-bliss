import { Router } from 'express';
import {
  getAllTransactions,
  getTransactionById,
  updateTransaction,
} from '../controllers/transactionController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.route('/')
  .get(getAllTransactions);

router.route('/:id')
  .get(getTransactionById)
  .patch(updateTransaction);

export default router;
