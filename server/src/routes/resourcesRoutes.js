import { Router } from 'express';
import { Resource } from '../models/Resource.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const resources = await Resource.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ resources });
  })
);

export default router;
