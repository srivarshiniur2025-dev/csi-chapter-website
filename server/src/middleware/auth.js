import { User } from '../models/User.js';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';

async function resolveUserFromIdToken(idToken) {
  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }
  const decoded = await app.auth().verifyIdToken(idToken);
  let user =
    (decoded.uid && (await User.findOne({ firebaseUid: decoded.uid }))) ||
    (decoded.email && (await User.findOne({ email: decoded.email.toLowerCase() })));

  if (!user && decoded.email) {
    user = await User.create({
      name: decoded.name || decoded.email.split('@')[0] || 'CSI Member',
      email: decoded.email.toLowerCase(),
      firebaseUid: decoded.uid,
      department: '',
      domainInterests: [],
    });
  } else if (user && decoded.uid && !user.firebaseUid) {
    user.firebaseUid = decoded.uid;
    await user.save();
  }

  return user;
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!idToken) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const user = await resolveUserFromIdToken(idToken);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.message === 'FIREBASE_NOT_CONFIGURED') {
      return res.status(503).json({ message: 'Server auth requires Firebase Admin configuration' });
    }
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!idToken) {
    req.user = null;
    return next();
  }
  try {
    const user = await resolveUserFromIdToken(idToken);
    req.user = user && user.isActive ? user : null;
  } catch {
    req.user = null;
  }
  next();
}
