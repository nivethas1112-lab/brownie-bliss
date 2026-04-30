import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes
router.post('/', auth, createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router;
