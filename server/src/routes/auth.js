import { Router } from 'express';
import {
  login,
  logout,
  refresh,
  getMe,
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);

export default router;
