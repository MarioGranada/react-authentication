# AGENTS.md — React Authentication

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `vercel env pull .env.local` | Pull `POSTGRES_URL`, `JWT_SECRET` and `CRON_SECRET` into the gitignored root `.env.local`. |
| `npm ci --prefix backend && npm run db:migrate --prefix backend` | Install the API and apply the idempotent schema + seed. |
| `npm run dev --prefix backend` | Run the API on port 8080 (routes under `/api`). |
| `npm ci --prefix frontend && npm run dev --prefix frontend` | Run the SPA on port 3000; Vite proxies `/api`. |
| `npm run build --prefix frontend && npm run lint --prefix frontend` | Verify the production bundle and lint. |

## Requirements

- Node.js 22 LTS (`backend/package.json` pins `22.x` for the Vercel Function).
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for the frontend.

## Environment

- `POSTGRES_URL` (transaction pooler) and `POSTGRES_URL_NON_POOLING` come from the Supabase integration on Vercel. `JWT_SECRET` signs tokens (the API refuses to issue or accept tokens without it). `CRON_SECRET` protects `/api/cron/reset`. Locally all live in the root `.env.local` (gitignored); backend scripts load it with `--env-file-if-exists=../.env.local`.
- `VITE_API_URL` is optional; the SPA defaults to the same-origin `/api`.
- Never commit `.env*` files (except `.env.example`), `.vercel/`, database URLs, secrets, or tokens.

## Architecture

- `vercel.json` — Vercel Services: `frontend` (Vite, SPA fallback) and `backend` (Express); `/api/*` → backend; nightly cron.
- `frontend/src/App.jsx` — route tree, loaders, and actions.
- `frontend/src/helpers/` — token storage, auth guard, token duration.
- `frontend/src/pages/Authentication.jsx` — login/signup action.
- `backend/routes/auth.js` — signup and login endpoints.
- `backend/util/auth.js` — JWT signing, verification, and auth middleware.
- `backend/routes/events.js` — event CRUD protected by `checkAuth`; `data/*.js` — SQL.
- `backend/app.js` — Express app exported for Vercel; `server.js` only listens locally.
- `backend/db/sql.js` — schema + seed and reset SQL (in JS so the function bundle includes it); `db/seed.js` applies them.
- `backend/routes/cron.js` — nightly reset (users + events), refuses requests without `Bearer $CRON_SECRET`.

## Commands and build order

- Run both servers; the SPA cannot authenticate or load events without the API.
- `npm run build --prefix frontend` and `npm run lint --prefix frontend` are the gates.
- Schema changes go in `backend/db/sql.js`, must stay idempotent, and need `npm run db:migrate --prefix backend` against the shared database.

## Conventions and gotchas

- The backend must run before the frontend performs any auth or event request.
- Changing `JWT_SECRET` invalidates every existing token.
- Router loaders run before the route renders; redirects must be returned, not thrown as strings.
- Vite inlines `VITE_*` variables at build time; never put secrets in them.
- Every API route lives under `/api`, because Vercel passes the original path to the backend service.
- Do not read files at runtime in the backend: the Vercel service bundle only includes traced JS.
- Keep `prepare: false` in `db/index.js` (the Supabase pooler has no prepared statements).
- The database is shared with other portfolio apps; only touch the `react_auth` schema.
- Never return password hashes, and never send database errors to the browser.
- The header holds a second form (newsletter); scope selectors to `main form` in browser tests.
- The auth token is read from `localStorage`; clearing site data logs the user out.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
