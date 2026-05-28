# CSI Chapter Website

Official student chapter site for CSI VIT Chennai — built with React, TypeScript, and Vite.

## Development

```bash
npm install
cp .env.example .env
# Optional: set VITE_API_URL=http://localhost:5000 for Mongo-backed auth/events
npm run dev
```

### Full-stack (Mongo API)

1. Start MongoDB (local or Atlas — see `server/README.md`).
2. `cd server && cp .env.example .env` → set `MONGODB_URI` and `JWT_SECRET`.
3. `npm install && npm run seed && npm run dev` (API on port 5000).
4. In project root `.env`, set `VITE_API_URL=http://localhost:5000`.
5. Run `npm run dev` for the frontend.

From the repo root you can also use `npm run dev:api` and `npm run seed:api`.

## Build

```bash
npm run build
```

## Deploy

Configured for Vercel (`vercel.json`).
