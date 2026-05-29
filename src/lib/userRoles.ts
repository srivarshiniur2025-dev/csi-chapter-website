import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export type UserRole = 'user' | 'admin';

function adminEmails(): string[] {
  const raw =
    (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || 'admin@csi.vitc.edu';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function roleFromEmail(email: string): UserRole {
  return adminEmails().includes(email.toLowerCase()) ? 'admin' : 'user';
}

/** Read role from Firestore; returns null if Firebase is not configured. */
export async function getFirestoreRole(uid: string): Promise<UserRole | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data().role === 'admin' ? 'admin' : 'user';
}

/** Ensure a user profile exists and return their role (Firestore is the UI source of truth). */
export async function ensureFirestoreUser(
  uid: string,
  email: string,
  displayName: string | null
): Promise<UserRole> {
  if (!isFirebaseConfigured() || !db) {
    return roleFromEmail(email);
  }
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const role = roleFromEmail(email);
    await setDoc(ref, {
      email: email.toLowerCase(),
      displayName: displayName || '',
      role,
      updatedAt: serverTimestamp(),
    });
    return role;
  }
  const data = snap.data();
  return data.role === 'admin' ? 'admin' : 'user';
}

export async function setFirestoreRole(uid: string, role: UserRole): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { role, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { role, updatedAt: serverTimestamp() });
  }
}
