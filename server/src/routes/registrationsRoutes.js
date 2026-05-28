import { Router } from 'express';
import {
  registerForEvent,
  myRegistrations,
  adminListRegistrations,
  updateRegistrationStatus,
} from '../controllers/registrationsController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

router.get('/me', requireAuth, myRegistrations);
router.post('/events/:slug', requireAuth, registerForEvent);
router.get('/admin', requireAuth, requireAdmin, adminListRegistrations);
router.patch('/admin/:id', requireAuth, requireAdmin, updateRegistrationStatus);

export default router;
