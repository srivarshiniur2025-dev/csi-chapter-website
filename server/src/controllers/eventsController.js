import { Event } from '../models/Event.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listEvents = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'admin' ? {} : { isPublished: true };
  const events = await Event.find(filter).sort({ startISO: 1 });
  res.json({ events: events.map((e) => e.toPublicJSON()) });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event || (!event.isPublished && req.user?.role !== 'admin')) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json({ event: event.toPublicJSON() });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ event: event.toPublicJSON() });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ event: event.toPublicJSON() });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndDelete({ slug: req.params.slug });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ message: 'Event deleted' });
});
