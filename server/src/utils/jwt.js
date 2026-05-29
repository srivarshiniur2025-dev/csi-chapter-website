import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signUserToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function verifyUserToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
