import { Router } from 'express';
import { listProjects } from '../controllers/projectController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, listProjects);

export default router;
