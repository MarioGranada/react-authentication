# React Authentication

A full-stack events app used to practise authentication in React. Users can sign up, log in, browse events, and create, edit, or delete events; only authenticated users can reach the mutation routes.

The frontend is a Vite SPA using React Router data APIs. The backend is a small Express API that hashes passwords with bcrypt, issues one-hour JWTs, and stores users and events in a `react_auth` schema of a hosted Supabase Postgres database. Both deploy together as one Vercel project.

> **Follow-along project.** This app was built while following **React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Live demo

| | |
| --- | --- |
| **Live site** | https://react-authentication-xi-ivory.vercel.app |
| **Repository** | https://github.com/MarioGranada/react-authentication |
| **Portfolio summary** | Token-based authentication in a React Router SPA: signup, login, auto-logout on JWT expiry and protected event mutations, backed by an Express API and Supabase Postgres on Vercel. |

The demo is public. Accounts and events are wiped every night (04:00 UTC) and the three sample events are restored, so sign up with any throwaway email.

## Features

- Signup and login forms with server-side validation.
- Passwords hashed with bcrypt before storage; hashes never leave the API.
- JWT authentication with a one-hour expiry and automatic logout.
- Token persisted in `localStorage` and attached to protected requests.
- Protected routes enforced by router loaders.
- Event list (streamed with `defer`/`Await`), detail, create, edit, and delete flows.
- Logout action that clears the token.
- Shared error handling for auth and API failures.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite 8 |
| Routing | React Router 6 data APIs |
| Backend | Express 4 (Vercel Function in production) |
| Auth | jsonwebtoken 9 + bcryptjs |
| Persistence | Supabase Postgres via postgres.js |
| Hosting | Vercel Services (frontend + backend in one project), nightly Vercel Cron |

## Project structure

```text
react-authentication/
├── vercel.json                # Services (frontend, backend), /api routing, nightly cron
├── backend/
│   ├── app.js                 # Express app; every route under /api
│   ├── server.js              # Local dev server (port 8080)
│   ├── routes/auth.js         # POST /api/signup and /api/login
│   ├── routes/events.js       # Event CRUD; mutations need a valid JWT
│   ├── routes/cron.js         # GET /api/cron/reset (needs CRON_SECRET)
│   ├── data/                  # user.js, event.js (SQL)
│   ├── db/                    # postgres.js client, schema + seed SQL, reset helper
│   ├── scripts/db.js          # npm run db:migrate | db:reset
│   └── util/                  # JWT + bcrypt helpers, validation, errors
└── frontend/
    ├── src/
    │   ├── pages/             # Authentication, Events, EventDetail, Edit, New, Logout
    │   ├── components/        # AuthForm, EventForm, lists, navigation
    │   ├── helpers/           # token storage, loaders, duration
    │   ├── config.js          # API_URL (defaults to /api)
    │   └── App.jsx            # Router configuration
    └── vite.config.mjs        # Dev proxy: /api -> localhost:8080
```

## Getting started

### Requirements

- Node.js 22 LTS.
- npm (lockfiles are committed for both apps).
- The Vercel CLI, linked to the project, to pull the environment (`vercel link`, then `vercel env pull .env.local` in the repo root).
- Two terminals: one for the API and one for the frontend.

### 1. Install dependencies

```bash
npm ci --prefix backend
npm ci --prefix frontend
```

### 2. Configure the environment and database

```bash
vercel env pull .env.local            # POSTGRES_URL(_NON_POOLING), JWT_SECRET, CRON_SECRET
npm run db:migrate --prefix backend   # idempotent: creates the schema and seed events
```

`.env.local` is gitignored. Without Vercel, set `POSTGRES_URL` (any Postgres) and `JWT_SECRET` (any long random string) yourself.

### 3. Run locally

```bash
npm run dev --prefix backend     # API on http://localhost:8080/api
npm run dev --prefix frontend    # SPA on http://localhost:3000
```

Vite proxies `/api` to the backend, so the SPA uses the same relative URLs as in production.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev --prefix backend` | API with `--watch` on port 8080. |
| `npm run db:migrate --prefix backend` | Apply the schema and seed (idempotent). |
| `npm run db:reset --prefix backend` | Delete all users and events and restore the seed events. |
| `npm run dev --prefix frontend` | Vite dev server on port 3000. |
| `npm run build --prefix frontend` | Production build into `frontend/dist`. |
| `npm run lint --prefix frontend` | ESLint. |

## How it works

`frontend/src/App.jsx` builds the router. The root route runs `tokenLoader`, which reads the token from `localStorage`, so every route can inspect auth state through `useRouteLoaderData("root")`. The root layout schedules an automatic logout when the token expires.

`checkAuthLoader` guards the new-event and edit-event routes and redirects unauthenticated users to `/`. The `Authentication` page action posts to `/api/login` or `/api/signup`, stores the returned token, and navigates home.

`getAuthToken` and the token helpers centralise storage access and expiry handling. `Logout` removes the token and redirects.

`EventForm` and the event pages use router actions for POST, PATCH, and DELETE. Protected requests attach `Authorization: Bearer <token>`.

On the backend, `routes/auth.js` validates input, checks for an existing email, hashes the password with bcrypt, and returns a JWT signed with `JWT_SECRET`. `util/auth.js` verifies tokens in `checkAuth`, which guards event mutations. Server errors return a generic message; database errors are only logged on the server.

## Deployment

- **Live:** https://react-authentication-xi-ivory.vercel.app
- One Vercel project with two [Services](https://vercel.com/docs/services) defined in `vercel.json`: `frontend` (Vite static build with SPA fallback) and `backend` (Express as a Vercel Function). `/api/*` routes to the backend, everything else to the frontend.
- Pushing to `master` deploys production.
- Environment variables: `POSTGRES_URL` comes from the Supabase integration on Vercel; `JWT_SECRET` signs tokens; `CRON_SECRET` protects the reset endpoint.
- A daily Vercel Cron calls `/api/cron/reset` at 04:00 UTC to delete all users and events and restore the seed events.

## Notes and limitations

- The token is stored in `localStorage`, so it is readable by JavaScript; any XSS becomes a session compromise. A production app should prefer httpOnly cookies.
- There is no refresh-token flow; tokens expire after one hour and the user must log in again.
- Any signed-in user can edit or delete any event (no per-user ownership), as in the course project.
- The Newsletter page is a frontend-only demo; it does not store emails.

---

**Author:** Mario Granada
