import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { Announcement } from '../models/Announcement.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [registrations, bookmarks, resources, announcements, notifications] = await Promise.all([
    Registration.find({ user: req.user._id }).populate('event').sort({ createdAt: -1 }).limit(20),
    Event.find({ _id: { $in: req.user.bookmarkedEvents } }),
    Resource.find({ isPublished: true }).sort({ createdAt: -1 }).limit(12),
    Announcement.find({ isPublished: true, audience: { $in: ['all', 'members'] } })
      .sort({ createdAt: -1 })
      .limit(10),
    Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20),
  ]);

  const stats = {
    eventsRegistered: registrations.length,
    bookmarks: bookmarks.length,
    achievements: req.user.achievements.length,
    resourcesSaved: req.user.savedResources.length,
  };

  res.json({
    user: req.user.toSafeJSON(),
    stats,
    registeredEvents: registrations.map((r) => ({
      registrationId: r.registrationId,
      status: r.status,
      event: r.event?.toPublicJSON?.() || null,
      createdAt: r.createdAt,
    })),
    bookmarks: bookmarks.map((e) => e.toPublicJSON()),
    resources,
    announcements,
    notifications,
    reminders: registrations
      .filter((r) => r.event?.startISO)
      .slice(0, 5)
      .map((r) => ({
        id: r._id,
        title: r.event.title,
        when: r.event.startISO,
        venue: r.event.venue,
      })),
  });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const id = event._id.toString();
  const set = new Set(req.user.bookmarkedEvents.map((x) => x.toString()));
  if (set.has(id)) set.delete(id);
  else set.add(id);
  req.user.bookmarkedEvents = [...set];
  await req.user.save();
  res.json({ bookmarked: set.has(id), bookmarkedEvents: req.user.bookmarkedEvents });
});

export const toggleResourceSave = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;
  const set = new Set(req.user.savedResources);
  if (set.has(resourceId)) set.delete(resourceId);
  else set.add(resourceId);
  req.user.savedResources = [...set];
  await req.user.save();
  res.json({ saved: set.has(resourceId), savedResources: req.user.savedResources });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, user: req.user._id },
    { read: true }
  );
  res.json({ message: 'ok' });
});
