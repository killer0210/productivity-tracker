# Productivity Tracker

Authenticated productivity logging platform. Users log activities via voice (Web Speech API) or text with structured fields: Where / What / When / Duration. Entries appear in a list, calendar view, and can be exported to Excel.

## Stack

- **Frontend:** Vite + React + Tailwind CSS v3 — deploy to Vercel
- **Backend:** Node.js + Express + Mongoose (MongoDB Atlas) — deploy to Render

## Project Structure

```
/client   — Vite + React frontend
/server   — Express + Mongoose backend
```

## Local Development

### Prerequisites
- Node.js >= 18
- MongoDB Atlas cluster (or local MongoDB)

### Server

```bash
cd server
npm install
cp .env.example .env   # fill in values
npm run dev
```

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/...
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

### Client

```bash
cd client
npm install
cp .env.example .env   # fill in values
npm run dev
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Backend — Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect this repository, set **Root Directory** to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` — set to your Vercel frontend URL

### Frontend — Vercel

1. Import this repository on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_URL` — set to your Render backend URL + `/api`

## Features

- JWT authentication (register / login)
- Voice input via Web Speech API
- Text entry with Where / What / When / Duration fields
- Custom template fields (Settings)
- Date-sorted entry list with search and category filter
- Calendar view — click any day to see entries
- Excel export (.xlsx) via ExcelJS
- Responsive layout — sidebar on desktop, bottom nav + FAB on mobile
