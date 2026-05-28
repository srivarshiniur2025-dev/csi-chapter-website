import { Router } from 'express';
import {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

router.get('/', optionalAuth, listGallery);
router.post('/', requireAuth, requireAdmin, createGalleryItem);
router.patch('/:id', requireAuth, requireAdmin, updateGalleryItem);
router.delete('/:id', requireAuth, requireAdmin, deleteGalleryItem);

export default router;
