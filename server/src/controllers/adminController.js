import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Announcement } from '../models/Announcement.js';
import { Resource } from '../models/Resource.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const analytics = asyncHandler(async (req, res) => {
  const [users, events, registrations, announcements] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments(),
    Announcement.countDocuments({ isPublished: true }),
  ]);
  const recentRegs = await Registration.find()
    .populate('user', 'name email')
    .populate('event', 'title')
    .sort({ createdAt: -1 })
    .limit(10);
  res.json({
    analytics: { users, events, registrations, announcements },
    recentRegistrations: recentRegs,
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json({ users: users.map((u) => u.toSafeJSON()) });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  ).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: user.toSafeJSON() });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const item = await Announcement.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json({ announcement: item });
});

export const createResource = asyncHandler(async (req, res) => {
  const item = await Resource.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json({ resource: item });
});

export const listResourcesAdmin = asyncHandler(async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json({ resources });
});
