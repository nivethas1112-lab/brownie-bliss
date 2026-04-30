import { Router } from 'express';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
// Public routes
router.post('/', createInquiry);

// Protected routes
router.get('/', auth, getAllInquiries);
router.route('/:id')
  .get(auth, getInquiryById)
  .delete(auth, deleteInquiry);

router.patch('/:id/status', auth, updateInquiryStatus);

export default router;
