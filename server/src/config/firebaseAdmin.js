import admin from 'firebase-admin';
import { env } from './env.js';

let firebaseApp = null;

export function getFirebaseAdmin() {
  if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) return null;
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.firebaseProjectId,
        clientEmail: env.firebaseClientEmail,
        privateKey: env.firebasePrivateKey,
      }),
    });
  }
  return firebaseApp;
}
