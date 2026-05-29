import { Event } from '../models/Event.js';
import { Announcement } from '../models/Announcement.js';
import { Registration } from '../models/Registration.js';
import { Resource } from '../models/Resource.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { optionalAuth } from '../middleware/auth.js';

const replies = {
  events: 'Check the Events section for workshops, hackathons, and tech talks. Register from any event card when logged in.',
  nova: 'I am CSI Nova — your chapter assistant. Ask about events, domains, or your dashboard.',
  domains: 'CSI domains include Web, AI/ML, Cloud, Cybersecurity, IoT, and Competitive Programming.',
  join: 'Use Login / Sign Up in the navbar to create your member profile and unlock the dashboard.',
};

export const assistantChat = [
  optionalAuth,
  asyncHandler(async (req, res) => {
    const message = (req.body.message || '').toLowerCase();
    let reply = replies.nova;
    let scrollTo;

    if (message.includes('dashboard') || message.includes('profile') || message.includes('pass')) {
      scrollTo = 'platform';
      if (req.user) {
        const regCount = await Registration.countDocuments({ user: req.user._id });
        reply = `Your dashboard has registrations (${regCount}), passes, certificates, and notifications. Tap your avatar or open /dashboard.`;
      } else {
        reply = 'Sign in to open your member dashboard — registrations, passes, and certificates live there.';
      }
    } else if (message.includes('register') || message.includes('registration')) {
      scrollTo = 'events';
      reply =
        'Pick an event → View details → Register. You receive a QR pass and confirmation in your dashboard.';
    } else if (message.includes('resource') || message.includes('learn') || message.includes('study')) {
      scrollTo = 'resources';
      const count = await Resource.countDocuments({ isPublished: true });
      reply = `The Resources hub has ${count}+ curated paths. Filter by domain or search. Members can save favorites.`;
    } else if (message.includes('project')) {
      scrollTo = 'projects';
      reply = 'See the Project Showcase for chapter builds with stacks and GitHub links.';
    } else if (message.includes('event') || message.includes('hackathon') || message.includes('workshop')) {
      scrollTo = 'events';
      const upcoming = await Event.find({ isPublished: true, startISO: { $gte: new Date() } })
        .sort({ startISO: 1 })
        .limit(5);
      const names = upcoming.map((e) => `${e.title} (${e.dateLabel})`).join('; ');
      reply = names
        ? `Upcoming: ${names}. Featured events appear at the top of Events.`
        : replies.events;
      if (req.user && upcoming.length) {
        const myRegs = await Registration.find({
          user: req.user._id,
          event: { $in: upcoming.map((e) => e._id) },
        }).select('event');
        if (myRegs.length) {
          reply += ` You are already registered for ${myRegs.length} upcoming event(s).`;
        }
      }
    } else if (message.includes('announce')) {
      const latest = await Announcement.find({ isPublished: true }).sort({ createdAt: -1 }).limit(1);
      reply = latest[0]
        ? `Latest: ${latest[0].title} — ${latest[0].body.slice(0, 120)}`
        : 'No announcements yet. Check back soon.';
    } else if (message.includes('domain')) {
      scrollTo = 'team';
      reply = replies.domains;
    } else if (message.includes('login') || message.includes('sign')) {
      reply = replies.join;
    } else if (message.includes('hello') || message.includes('hi')) {
      reply = req.user
        ? `Hello ${req.user.name.split(' ')[0]}! I am CSI Nova. Ask about your events, resources, or dashboard.`
        : 'Hello! I am CSI Nova. How can I help you today?';
    }

    res.json({ reply, scrollTo });
  }),
];
