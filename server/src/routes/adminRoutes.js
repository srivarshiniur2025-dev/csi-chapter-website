import { Router } from 'express';
import {
  analytics,
  listUsers,
  updateUserRole,
  createAnnouncement,
  createResource,
  listResourcesAdmin,
  updateResource,
  deleteResource,
  listRegistrations,
  listAnnouncements,
  deleteAnnouncement,
  sendNotification,
  listCertificates,
} from '../controllers/adminController.js';
import {
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { updateRegistrationStatus } from '../controllers/registrationsController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/analytics', analytics);
router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/announcements', createAnnouncement);
router.get('/announcements', listAnnouncements);
router.delete('/announcements/:id', deleteAnnouncement);
router.get('/resources', listResourcesAdmin);
router.post('/resources', createResource);
router.patch('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);
router.get('/registrations', listRegistrations);
router.patch('/registrations/:id', updateRegistrationStatus);
router.post('/notifications', sendNotification);
router.get('/certificates', listCertificates);
router.post('/projects', createProject);
router.patch('/projects/:slug', updateProject);
router.delete('/projects/:slug', deleteProject);

export default router;
