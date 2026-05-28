import { Router } from 'express';
import { signup, login, me, googleAuth, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', requireAuth, me);
router.patch('/profile', requireAuth, updateProfile);

export default router;
