# Project Constitution — React Authentication

This document defines the non-negotiable foundations for this repository. Read it before adding or changing features.

## Guiding Principles

- **Simplicity first** — prefer the smallest solution that solves the problem. If a change needs a long explanation, it is probably over-engineered.
- **No hardcoded secrets or endpoints** — configuration belongs in environment variables; visual design tokens belong in styles, not in `.env` files.
- **Traceability** — every value, dependency, and route should make its origin and purpose obvious.
- **Debuggability** — fail loudly and visibly; avoid silent fallbacks that hide broken data.
- **Official patterns** — use the documented API of each framework and library before inventing a workaround.
- **Portfolio clarity** — this repository is part of a public portfolio. Code should read as clean, intentional, and easy for a reviewer to follow. As a follow-along project, its purpose is to demonstrate the concepts practised in the course, not to imitate production scale.

## Technology Stack Foundations

| Layer | Choice | Rationale |
| --- | --- | --- |
| Frontend | React 18 + Vite 8 | Migrated from CRA; static SPA build. |
| Routing | React Router 6 data APIs | Loaders, actions, and protected routes keep data work outside components. |
| Backend | Express 4 | A small API demonstrates token issuing and verification; runs as a Vercel Function. |
| Auth | jsonwebtoken 9 + bcryptjs | JWT sessions and password hashing. |
| Persistence | Supabase Postgres (postgres.js) | Durable storage on serverless hosting; one schema (`react_auth`) in the shared portfolio database. |
| Hosting | Vercel Services + Cron | SPA and API ship together on one origin; nightly demo reset. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project for learning client/server authentication with JWTs. It is not a production identity system: it lacks refresh tokens, httpOnly cookies, and rate limiting. The public demo is kept clean by a nightly reset that deletes every account and event.

### 2. Environment Isolation

- Runtime configuration comes from environment variables: `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` (Supabase integration), `JWT_SECRET` and `CRON_SECRET`. Locally they live in the gitignored root `.env.local` (`vercel env pull .env.local`).
- Missing secrets fail closed: no `JWT_SECRET` means no tokens; no `CRON_SECRET` means no reset.
- Document every variable in the README and `AGENTS.md`.
- Never commit keys, tokens, database URLs, or credentials, and never log them or send database errors to the browser.

### 3. Architecture

- Auth helpers live in `frontend/src/helpers/`; pages and components should not read `localStorage` directly.
- Router loaders/actions own data fetching and mutations.
- Backend auth logic stays in `util/auth.js`; routes compose it rather than reimplementing verification.
- Every API route lives under `/api`; the frontend calls the same origin.
- The backend never reads files at runtime; SQL lives in `backend/db/sql.js`.

### 4. Data and State

- The `react_auth.users` and `react_auth.events` tables are the source of truth. Schema and seed changes stay idempotent (`npm run db:migrate --prefix backend`).
- Only touch the `react_auth` schema; the database is shared with other portfolio apps.
- The client stores only the JWT and derives auth state from it.
- Passwords are never returned to the client; only the token and user summary are sent.

### 5. Styling and UX

- Global styles and CSS Modules live with their components.
- Keep form errors visible and associated with the relevant field.
- Do not add a UI library for this course project.

### 6. Quality Gates

- `npm run build --prefix frontend` and `npm run lint --prefix frontend` are the main gates.
- Manually test signup, duplicate email, short password, login, wrong password, protected route redirect, create, edit, delete, logout, and an expired token.
- Confirm the API rejects mutations without a valid token.

### 7. Deployment

- One Vercel project (Services in `vercel.json`): `frontend` serves the Vite build with SPA fallback, `backend` runs Express. Pushing to `master` deploys production.
- The nightly cron `/api/cron/reset` deletes users and events and restores the seed.
- Delete any test data written to production after verifying.

## What to Avoid

- Hardcoding the JWT key or any other secret.
- Storing tokens in `localStorage` for a production app without acknowledging XSS risk.
- Trusting client-side route guards as the only authorization check.
- Committing user data, database dumps, or `.env*` files.
- Writing to local files from the API (not durable or writable on Vercel).
- Adding refresh-token complexity to a course demo without a clear need.

## Checklist Before Adding Anything New

- Does this solve a real problem for this project, or am I adding scope for its own sake?
- Is every new value configuration-driven rather than hardcoded?
- Does the change follow the existing folder and naming patterns?
- Is there a clear failure path when data, the network, or the environment is unavailable?
- Have I run the available lint/build/test command and fixed what it reports?
- Did I update `README.md` and `MEMORY.md` if behaviour or setup changed?

## Philosophy Statement

This repository exists to show thoughtful front-end engineering: clear structure, readable code, and deliberate trade-offs. The goal is not to use every tool available, but to make every file explain itself. Simplicity is the feature.
