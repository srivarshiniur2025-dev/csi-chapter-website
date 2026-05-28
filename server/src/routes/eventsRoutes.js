import { Router } from 'express';
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventsController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

router.get('/', optionalAuth, listEvents);
router.get('/:slug', optionalAuth, getEvent);
router.post('/', requireAuth, requireAdmin, createEvent);
router.patch('/:slug', requireAuth, requireAdmin, updateEvent);
router.delete('/:slug', requireAuth, requireAdmin, deleteEvent);

export default router;
