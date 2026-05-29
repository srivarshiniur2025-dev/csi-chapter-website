import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Notification } from '../models/Notification.js';
import { Certificate } from '../models/Certificate.js';
import { generateRegistrationId } from '../utils/registrationId.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function issueCertificate(reg, event, user) {
  const existing = await Certificate.findOne({ user: user._id, event: event._id });
  if (existing) return existing;
  return Certificate.create({
    user: user._id,
    event: event._id,
    registration: reg._id,
    registrationId: reg.registrationId,
    eventTitle: event.title,
    memberName: user.name,
    verifyCode: reg.registrationId,
  });
}

export const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug, isPublished: true });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.seatsTaken >= event.totalSeats) {
    return res.status(409).json({ message: 'Event is full' });
  }

  const existing = await Registration.findOne({ user: req.user._id, event: event._id });
  if (existing) {
    return res.status(409).json({
      message: 'Already registered',
      registration: {
        registrationId: existing.registrationId,
        status: existing.status,
        attended: existing.attended,
        event: event.toPublicJSON(),
      },
    });
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
    message: `You are registered for ${event.title}. Pass ID: ${registrationId}`,
    type: 'event',
  });

  res.status(201).json({
    registration: {
      id: registration._id,
      registrationId,
      event: event.toPublicJSON(),
      form,
      status: registration.status,
      attended: registration.attended,
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
      attended: r.attended,
      attendedAt: r.attendedAt,
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
  const reg = await Registration.findById(req.params.id).populate('event').populate('user');
  if (!reg) return res.status(404).json({ message: 'Registration not found' });

  if (req.body.status) reg.status = req.body.status;
  if (typeof req.body.attended === 'boolean') {
    reg.attended = req.body.attended;
    reg.attendedAt = req.body.attended ? new Date() : undefined;
    if (req.body.attended && reg.event && reg.user) {
      await issueCertificate(reg, reg.event, reg.user);
      await Notification.create({
        user: reg.user._id,
        title: 'Attendance confirmed',
        message: `Your attendance for ${reg.event.title} was recorded. Certificate is available in your dashboard.`,
        type: 'achievement',
      });
    }
  }
  await reg.save();
  res.json({ registration: reg });
});
