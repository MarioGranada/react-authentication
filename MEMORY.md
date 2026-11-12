# React Authentication — Working Memory

_Last updated: 2026-11-12_

## Current status

- Live on Vercel: https://react-authentication-xi-ivory.vercel.app (pushes to `master` deploy production).
- One Vercel project with Services: `frontend` (Vite 8 SPA) + `backend` (Express under `/api`).
- Users and events live in the `react_auth` schema of the shared Supabase Postgres (`portfolio-db`).
- `JWT_SECRET` and `CRON_SECRET` are Vercel env vars (random, never printed or committed).
- Nightly Vercel Cron (04:00 UTC) calls `/api/cron/reset`: deletes users and events, restores 3 seed events.
- Signup, login, protected create/edit/delete, validation and 404 flows verified in headless Chrome against production.
- No automated tests.

## Key decisions

- Used React Router loaders/actions so auth and data work stay outside components.
- Replaced the JSON files with Postgres (files are not writable or durable on Vercel).
- Same-origin `/api` (Vite proxy locally) instead of a separate API host: no CORS, no URL env var.
- JWT key moved from the hardcoded `supersecret` to `JWT_SECRET`; missing key fails closed.
- Seed and reset SQL live in `backend/db/sql.js`: the Vercel service bundle dropped runtime-read files.

## Known limitations and follow-ups

- Token in `localStorage` with no refresh flow.
- No rate limiting, email verification, password reset, or per-user event ownership.

## Mistakes to avoid

- Starting only the frontend makes login fail silently from the user’s perspective.
- A changed `JWT_SECRET` invalidates all existing sessions.
- Forgetting the `Authorization` header on a mutation returns a 401.
- Browser tests: the header's newsletter form is the first `form` on every page (it raises an `alert`).

## Next steps

- Add tests for the auth routes and route guards.
- Consider httpOnly cookies instead of `localStorage`.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
