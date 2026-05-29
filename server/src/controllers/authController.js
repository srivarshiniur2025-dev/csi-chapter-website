import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signUserToken } from '../utils/jwt.js';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().optional(),
  domainInterests: z.array(z.string()).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function authResponse(user) {
  return { user: user.toSafeJSON(), token: signUserToken(user) };
}

export const signup = asyncHandler(async (req, res) => {
  const body = signupSchema.parse(req.body);
  const exists = await User.findOne({ email: body.email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  const passwordHash = await bcrypt.hash(body.password, 10);
  const user = await User.create({
    name: body.name,
    email: body.email.toLowerCase(),
    passwordHash,
    department: body.department || '',
    domainInterests: body.domainInterests || [],
  });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await User.findOne({ email: body.email.toLowerCase() });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  user.lastLoginAt = new Date();
  await user.save();
  res.json(authResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'idToken required' });
  }
  const app = getFirebaseAdmin();
  if (!app) {
    return res.status(503).json({ message: 'Google auth not configured on server' });
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
    });
  } else if (!user.firebaseUid) {
    user.firebaseUid = decoded.uid;
    await user.save();
  }
  user.lastLoginAt = new Date();
  await user.save();
  res.json(authResponse(user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, department, domainInterests } = req.body;
  if (name) req.user.name = name;
  if (department !== undefined) req.user.department = department;
  if (domainInterests) req.user.domainInterests = domainInterests;
  await req.user.save();
  res.json({ user: req.user.toSafeJSON() });
});
