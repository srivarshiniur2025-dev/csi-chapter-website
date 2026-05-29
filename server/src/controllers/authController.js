import { z } from 'zod';
import { User } from '../models/User.js';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function isAdminEmail(email) {
  const target = (email || '').toLowerCase();
  const list = [env.adminEmail, ...(process.env.ADMIN_EMAILS || '').split(',')]
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(target);
}

function userResponse(user) {
  return { user: user.toSafeJSON() };
}

export const me = asyncHandler(async (req, res) => {
  res.json(userResponse(req.user));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'idToken required' });
  }
  const app = getFirebaseAdmin();
  if (!app) {
    return res.status(503).json({ message: 'Firebase Admin not configured on server' });
  }
  const decoded = await app.auth().verifyIdToken(idToken);
  let user = await User.findOne({ email: decoded.email?.toLowerCase() });
  if (!user) {
    user = await User.create({
      name: decoded.name || decoded.email?.split('@')[0] || 'CSI Member',
      email: decoded.email?.toLowerCase(),
      firebaseUid: decoded.uid,
      department: '',
      domainInterests: [],
      role: isAdminEmail(decoded.email) ? 'admin' : 'user',
    });
  } else {
    if (!user.firebaseUid) user.firebaseUid = decoded.uid;
    if (isAdminEmail(decoded.email)) user.role = 'admin';
    await user.save();
  }
  user.lastLoginAt = new Date();
  await user.save();
  res.json(userResponse(user));
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  domainInterests: z.array(z.string()).optional(),
});

export const updateProfile = asyncHandler(async (req, res) => {
  const body = profileSchema.parse(req.body);
  if (body.name) req.user.name = body.name;
  if (body.department !== undefined) req.user.department = body.department;
  if (body.domainInterests) req.user.domainInterests = body.domainInterests;
  await req.user.save();
  res.json(userResponse(req.user));
});
