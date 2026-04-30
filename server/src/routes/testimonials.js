import { Router } from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
} from '../controllers/testimonialController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes
router.post('/', auth, createTestimonial);
router.put('/:id', auth, updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);
router.patch('/:id/approve', auth, approveTestimonial);

export default router;
