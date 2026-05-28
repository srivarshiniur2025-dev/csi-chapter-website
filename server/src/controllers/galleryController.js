import { GalleryItem } from '../models/GalleryItem.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listGallery = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'admin' && req.query.all === '1' ? {} : { isPublished: true };
  const category = req.query.category;
  if (category && category !== 'All') filter.category = category;
  const items = await GalleryItem.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ items: items.map((i) => i.toPublicJSON()) });
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ item: item.toPublicJSON() });
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: 'Gallery item not found' });
  res.json({ item: item.toPublicJSON() });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Gallery item not found' });
  res.json({ message: 'Deleted' });
});
