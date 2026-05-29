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

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekRegs = await Registration.find({ createdAt: { $gte: sevenDaysAgo } }).select('createdAt');
  const registrationTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = weekRegs.filter((r) => r.createdAt >= d && r.createdAt < next).length;
    registrationTrend.push({
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      count,
    });
  }

  const topEventsAgg = await Registration.aggregate([
    { $group: { _id: '$event', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  const eventIds = topEventsAgg.map((t) => t._id);
  const eventDocs = await Event.find({ _id: { $in: eventIds } });
  const topEvents = topEventsAgg.map((t) => ({
    title: eventDocs.find((e) => e._id.equals(t._id))?.title ?? 'Event',
    count: t.count,
  }));

  res.json({
    analytics: { users, events, registrations, announcements },
    registrationTrend,
    topEvents,
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

export const listRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find()
    .populate('user', 'name email role')
    .populate('event', 'title slug')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ registrations });
});

export const listAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json({ announcements });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted' });
});
