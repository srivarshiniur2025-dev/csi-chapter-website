import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { generateRegistrationId } from '../utils/registrationId.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug, isPublished: true });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.seatsTaken >= event.totalSeats) {
    return res.status(409).json({ message: 'Event is full' });
  }

  const existing = await Registration.findOne({ user: req.user._id, event: event._id });
  if (existing) {
    return res.status(409).json({ message: 'Already registered', registration: existing });
  }

  const registrationId = generateRegistrationId(event.slug);
  const form = req.body.form || {
    name: req.user.name,
    email: req.user.email,
    domain: req.user.domainInterests?.[0] || '',
    yearDept: req.user.department || '',
    message: req.body.message || '',
  };

  const registration = await Registration.create({
    user: req.user._id,
    event: event._id,
    registrationId,
    form,
    qrPayload: `CSI|${registrationId}|${event.slug}`,
    status: 'approved',
  });

  event.seatsTaken += 1;
  await event.save();

  if (!req.user.achievements.includes('First Event')) {
    req.user.achievements.push('First Event');
    await req.user.save();
  }

  await Notification.create({
    user: req.user._id,
    title: 'Registration confirmed',
    message: `You are registered for ${event.title}. ID: ${registrationId}`,
    type: 'event',
  });

  res.status(201).json({
    registration: {
      id: registration._id,
      registrationId,
      event: event.toPublicJSON(),
      form,
      status: registration.status,
      createdAt: registration.createdAt,
    },
  });
});

export const myRegistrations = asyncHandler(async (req, res) => {
  const regs = await Registration.find({ user: req.user._id })
    .populate('event')
    .sort({ createdAt: -1 });
  res.json({
    registrations: regs.map((r) => ({
      id: r._id,
      registrationId: r.registrationId,
      status: r.status,
      form: r.form,
      createdAt: r.createdAt,
      event: r.event?.toPublicJSON?.() || null,
    })),
  });
});

export const adminListRegistrations = asyncHandler(async (req, res) => {
  const filter = req.query.event ? { event: req.query.event } : {};
  const regs = await Registration.find(filter)
    .populate('user', 'name email department')
    .populate('event', 'title slug dateLabel')
    .sort({ createdAt: -1 });
  res.json({ registrations: regs });
});

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const reg = await Registration.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  res.json({ registration: reg });
});
