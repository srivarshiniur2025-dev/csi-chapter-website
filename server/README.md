# CSI Platform API

Express + MongoDB backend for events, registrations, CMS content, and CSI Nova.

Authentication is **Firebase only**: the client sends a Firebase ID token; the server verifies it with Firebase Admin and loads the member from MongoDB.

## Setup

```bash
cd server
cp .env.example .env
# Set MONGODB_URI and Firebase Admin credentials
npm install
npm run seed
npm run dev
```

API default: `http://localhost:5000`

## Auth flow

1. User signs in on the client with **Firebase** (email/password, Google, persistent session).
2. Client calls `POST /api/auth/google` with `{ idToken }` to sync the user in MongoDB.
3. Protected routes use `Authorization: Bearer <Firebase ID token>`.

Roles for the UI are stored in **Firestore** (`users/{uid}`). The API uses the `role` field on the MongoDB user for admin-only routes (`ADMIN_EMAIL` is promoted to admin on sync).

## Frontend `.env`

```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAILS=admin@csi.vitc.edu
```

Without `VITE_API_URL`, the site runs in **local demo mode** (browser storage, no cloud API).

## Firestore rules (example)

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Adjust for your chapter’s admin promotion workflow.
