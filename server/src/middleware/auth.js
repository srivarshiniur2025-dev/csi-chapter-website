import { User } from '../models/User.js';
import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import { verifyUserToken } from '../utils/jwt.js';

async function resolveUserFromJwt(token) {
  const payload = verifyUserToken(token);
  const user = await User.findById(payload.sub);
  return user;
}

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

async function resolveUserFromBearer(token) {
  try {
    const user = await resolveUserFromJwt(token);
    if (user) return user;
  } catch {
    /* not a platform JWT — try Firebase */
  }
  return resolveUserFromIdToken(token);
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!bearer) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const user = await resolveUserFromBearer(bearer);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.message === 'FIREBASE_NOT_CONFIGURED') {
      return res.status(401).json({
        message: 'Invalid session. Use email login for API JWT or configure Firebase Admin.',
      });
    }
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!bearer) {
    req.user = null;
    return next();
  }
  try {
    const user = await resolveUserFromBearer(bearer);
    req.user = user && user.isActive ? user : null;
  } catch {
    req.user = null;
  }
  next();
}
