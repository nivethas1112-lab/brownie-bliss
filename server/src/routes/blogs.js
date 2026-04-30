import { Router } from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

export default router;
