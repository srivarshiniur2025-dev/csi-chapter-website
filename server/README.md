# CSI Platform API

Express + MongoDB backend for auth, events, registrations, dashboard, and admin.

## Setup

You need a MongoDB database (local install, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier).

```bash
cd server
cp .env.example .env
# Set MONGODB_URI (e.g. mongodb://127.0.0.1:27017/csi_platform or Atlas connection string)
# Set JWT_SECRET to a long random string
npm install
npm run seed
npm run dev
```

**Atlas quick steps:** create cluster → Database Access user → Network Access (allow your IP) → Connect → copy connection string into `MONGODB_URI`.

API runs at `http://localhost:5000` by default.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | — |
| POST | `/api/auth/signup` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/google` | Firebase idToken |
| GET | `/api/auth/me` | JWT |
| GET | `/api/events` | optional |
| POST | `/api/registrations/events/:slug` | JWT |
| GET | `/api/dashboard` | JWT |
| GET | `/api/admin/analytics` | admin |

Default admin (after seed): see `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## Frontend

Set in project root `.env`:

```
VITE_API_URL=http://localhost:5000
```
