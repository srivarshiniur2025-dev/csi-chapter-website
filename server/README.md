# CSI Platform API

Express + MongoDB backend for events, registrations, dashboard, admin CMS, and CSI Nova.

## Setup

You need MongoDB (local, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

```bash
cd server
cp .env.example .env
# MONGODB_URI, JWT_SECRET, optional Firebase Admin for Google sign-in
npm install
npm run seed
npm run dev
```

API default: `http://localhost:5000`

## Authentication

Protected routes accept **either**:

1. **JWT** — returned from `POST /api/auth/login`, `POST /api/auth/signup`, or `POST /api/auth/google` as `{ user, token }`. Send `Authorization: Bearer <token>`.
2. **Firebase ID token** — when Firebase Admin is configured in `.env`.

Email/password works without Firebase using JWT only.

## Key endpoints

| Area | Examples |
|------|----------|
| Auth | `POST /api/auth/signup`, `login`, `google` · `GET /api/auth/me` |
| Events | `GET /api/events` · admin `POST/PATCH/DELETE /api/events` |
| Registrations | `POST /api/registrations/events/:slug` · admin `PATCH /api/admin/registrations/:id` (attendance) |
| Dashboard | `GET /api/dashboard` (registrations, certificates, notifications) |
| CMS | `GET/POST /api/resources`, `/api/projects`, `/api/gallery` |
| Admin | `/api/admin/analytics`, notifications, users, announcements |
| Nova | `POST /api/assistant/chat` (live event data) |

Default admin after seed: `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## Frontend

Root `.env`:

```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_*=...   # optional; JWT works via email login when API is set
```

Without `VITE_API_URL`, the site uses **local demo mode** (browser storage).
