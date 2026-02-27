# TapTalent.ai

Full-stack weather dashboard with Google OAuth login.

- Frontend: React + Vite + Redux
- Backend: Node.js + Express + MongoDB + Passport Google OAuth

## Project Structure

```text
TapTalent.ai/
  backend/
  frontend/
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB Atlas connection string
- Google Cloud OAuth Web Client

## Local Setup

### 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
WEATHER_API_KEY=your_weather_api_key
CLIENT_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Run backend:

```bash
npm start
```

### 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## Production Deployment

## Backend (Render)

Set these environment variables in Render:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
WEATHER_API_KEY=...
CLIENT_URL=https://tap-talent-ai.vercel.app
GOOGLE_CALLBACK_URL=https://taptalent-ai-1.onrender.com/api/auth/google/callback
```

Health check:

`https://taptalent-ai-1.onrender.com/api/health`

## Frontend (Vercel)

Set only frontend-safe environment variables:

```env
VITE_API_BASE_URL=https://taptalent-ai-1.onrender.com
```

Do not store backend secrets on Vercel.

Vercel settings:

- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

This repo includes `frontend/vercel.json` for SPA route rewrites (required for `/auth`, `/settings`, etc.).

## Google OAuth Configuration

In Google Cloud Console (OAuth Web Client):

- Authorized JavaScript origins:
  - `https://tap-talent-ai.vercel.app`
- Authorized redirect URIs:
  - `https://taptalent-ai-1.onrender.com/api/auth/google/callback`

## API Routes

- `GET /api/health`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/weather?city=<city>`
- `GET /api/weather?lat=<lat>&lon=<lon>`
- `GET /api/weather/forecast?city=<city>`
- `GET /api/user/favorites`
- `POST /api/user/favorites`
- `DELETE /api/user/favorites/:city`

## Notes

- `Cannot GET /` on backend root is normal. Use `/api/*` routes.
- If frontend shows `404` on route refresh, confirm `frontend/vercel.json` is deployed.
- If login fails, verify `GOOGLE_CALLBACK_URL`, `CLIENT_URL`, and OAuth redirect URI match exactly.

## Security

- Never commit `.env` files.
- Keep backend secrets only on Render.
- Rotate secrets if they are exposed.
