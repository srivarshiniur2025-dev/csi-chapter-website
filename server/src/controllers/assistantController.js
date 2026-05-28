import { Event } from '../models/Event.js';
import { Announcement } from '../models/Announcement.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const replies = {
  events: 'Check the Events section for workshops, hackathons, and tech talks. Register from any event card when logged in.',
  nova: 'I am CSI Nova — your chapter assistant. Ask about events, domains, or your dashboard.',
  domains: 'CSI domains include Web, AI/ML, Cloud, Cybersecurity, IoT, and Competitive Programming.',
  join: 'Use Login / Sign Up in the navbar to create your member profile and unlock the dashboard.',
};

export const assistantChat = asyncHandler(async (req, res) => {
  const message = (req.body.message || '').toLowerCase();
  let reply = replies.nova;

  if (message.includes('event')) {
    const upcoming = await Event.find({ isPublished: true }).sort({ startISO: 1 }).limit(3);
    const names = upcoming.map((e) => e.title).join(', ');
    reply = names
      ? `Upcoming: ${names}. Open Events on the homepage to register.`
      : replies.events;
  } else if (message.includes('announce')) {
    const latest = await Announcement.find({ isPublished: true }).sort({ createdAt: -1 }).limit(1);
    reply = latest[0]
      ? `Latest: ${latest[0].title} — ${latest[0].body.slice(0, 120)}`
      : 'No announcements yet. Check back soon.';
  } else if (message.includes('domain')) {
    reply = replies.domains;
  } else if (message.includes('login') || message.includes('sign')) {
    reply = replies.join;
  } else if (message.includes('hello') || message.includes('hi')) {
    reply = 'Hello! I am CSI Nova. How can I help you today?';
  }

  res.json({ reply });
});
