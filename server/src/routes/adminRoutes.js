import { Router } from 'express';
import {
  analytics,
  listUsers,
  updateUserRole,
  createAnnouncement,
  createResource,
  listResourcesAdmin,
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/analytics', analytics);
router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/announcements', createAnnouncement);
router.get('/resources', listResourcesAdmin);
router.post('/resources', createResource);

export default router;
