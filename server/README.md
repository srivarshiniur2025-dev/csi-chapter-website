# CSI Platform API

Express + MongoDB backend for events, registrations, dashboard, and admin.

## Setup

You need a MongoDB database (local install, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier).

```bash
cd server
cp .env.example .env
# Set MONGODB_URI (e.g. mongodb://127.0.0.1:27017/csi_platform or Atlas connection string)
# Set Firebase Admin credentials (same project as frontend Firebase) for protected routes
npm install
npm run seed
npm run dev
```

**Atlas quick steps:** create cluster → Database Access user → Network Access (allow your IP) → Connect → copy connection string into `MONGODB_URI`.

API runs at `http://localhost:5000` by default.

## Authentication

Protected routes use **Firebase ID tokens** from the client (`Authorization: Bearer <firebaseIdToken>`). There is no JWT layer on this API.

Configure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `.env` (Firebase Console → Project settings → Service accounts).

The frontend signs in with Firebase; the API verifies each request with Firebase Admin.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | — |
| POST | `/api/auth/signup` | — (creates user record; client should use Firebase sign-in) |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/google` | Firebase `idToken` in body |
| GET | `/api/auth/me` | Firebase Bearer |
| GET | `/api/events` | optional |
| POST | `/api/registrations/events/:slug` | Firebase Bearer |
| GET | `/api/dashboard` | Firebase Bearer |
| GET | `/api/admin/analytics` | admin + Firebase Bearer |

Default admin (after seed): see `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`. Use the same email with Firebase (or demo local admin without API).

## Frontend

Set in project root `.env`:

```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_*=...
```

Without Firebase, the site runs in **local demo mode** (browser storage). Public API routes (e.g. events list) still work without auth.
