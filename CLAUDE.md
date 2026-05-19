# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

A productivity tracking platform where authenticated users log activities via voice (Web Speech API) or text. Each entry has structured fields: Where / What / When / Duration. Entries are displayed in a date/time-sorted list, a calendar view, and support search/filter, templates (custom fields), and Excel export.

## Tech Stack

- **Frontend:** Vite + React.js (JavaScript) + Tailwind CSS v3 — deployed to Vercel
- **Backend:** Node.js + Express.js + Mongoose (MongoDB) — deployed to Render
- **Speech:** Web Speech API (browser built-in, no external service)

## Repository Structure

```
/client   — Vite + React frontend
/server   — Express + Mongoose backend
```

## Common Commands

### Client
```bash
cd client
npm install
npm run dev        # start dev server (Vite)
npm run build      # production build
npm run preview    # preview production build
```

### Server
```bash
cd server
npm install
npm run dev        # nodemon watch mode
npm start          # production start
```

## Architecture

### Client (`/client/src`)
- `api/` — axios instances and request helpers, one file per resource (entries, templates, auth)
- `components/` — shared UI primitives; feature folders contain co-located components
- `pages/` — route-level components; one per view (Dashboard, Calendar, Settings)
- `hooks/` — custom hooks including `useSpeechRecognition` (wraps Web Speech API)
- State is local `useState`/`useContext`; no global state library unless deep prop-drilling requires it

### Server (`/server`)
- `routes/` — Express routers, one file per resource
- `controllers/` — business logic called by routers
- `models/` — Mongoose schemas (User, Entry, Template)
- `middleware/` — auth JWT verification, error handler
- Config from `.env`; never hard-code secrets

### Entry data shape
```js
{ user, where, what, when: Date, duration: Number, rawTranscript, createdAt }
```

## Coding Conventions

- **Language:** JavaScript (no TypeScript), `async/await` everywhere, functional React components
- **Naming:** camelCase variables/functions, PascalCase components, kebab-case files
- **API:** RESTful; all routes prefixed `/api/v1`; errors propagate to the central error middleware
- **Tailwind:** utility-first; no custom CSS files unless absolutely necessary; Tailwind v3 syntax only (`@tailwind` directives, not v4 `@import "tailwindcss"`)
- **Git:** conventional commits (`feat:`, `fix:`, `chore:`, etc.)

## Design System (Active Configuration)

Design dials for this project — lower variance and motion, higher density than skill defaults:

| Dial | Value | Meaning |
|------|-------|---------|
| DESIGN_VARIANCE | 4 | Offset asymmetric — subtle grid offsets, not chaotic |
| MOTION_INTENSITY | 3 | Static/CSS-only — `:hover` and `:active` states, no JS animation libraries |
| VISUAL_DENSITY | 7 | Dense data layout — minimal card boxes, `border-t` dividers, monospace numbers |

### Enforced rules (from `.agents/skills/`)
- **Font:** `Geist`, `Satoshi`, `Cabinet Grotesk`, or `Outfit`. `Inter` is banned.
- **Color:** One accent max (saturation < 80%). Never pure `#000000` — use Zinc-950. No purple/neon.
- **Numbers:** Monospace (`font-mono`) for all numeric data (density > 7).
- **Cards:** Banned in high-density views; use `border-t` / `divide-y` / negative space instead.
- **Full-height sections:** `min-h-[100dvh]` only — never `h-screen` (iOS Safari bug).
- **Animation:** `transform` and `opacity` only. Never animate `top`, `left`, `width`, `height`.
- **Icons:** `@phosphor-icons/react` (Light weight) or `@radix-ui/react-icons`. No thick Lucide defaults.
- **No emojis** anywhere in UI, code, or alt text.
- **Layout collapse:** All multi-column layouts collapse to single column below `768px`.
- **Dependency check:** Before importing any third-party library, verify it exists in `package.json`. Output the install command if missing.

## Speech Input

`useSpeechRecognition` wraps the browser's `window.SpeechRecognition` API. Always check for browser support before mounting the component. The transcript is editable before submission — treat the raw transcript as a draft, not a final value.

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `MONGO_URI` | server `.env` | MongoDB connection string |
| `JWT_SECRET` | server `.env` | Token signing key |
| `VITE_API_URL` | client `.env` | Backend base URL |
