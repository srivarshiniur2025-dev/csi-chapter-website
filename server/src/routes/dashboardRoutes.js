import { Router } from 'express';
import {
  getDashboard,
  toggleBookmark,
  toggleResourceSave,
  markNotificationRead,
} from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getDashboard);
router.post('/bookmarks/:slug', requireAuth, toggleBookmark);
router.post('/resources/save', requireAuth, toggleResourceSave);
router.patch('/notifications/:id/read', requireAuth, markNotificationRead);

export default router;
