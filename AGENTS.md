# AGENTS.md — React Authentication

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `cd backend && npm install && npm start` | Run the API on port 8080. |
| `cd frontend && npm install && npm start` | Run the SPA on port 3000. |
| `cd frontend && npm run build` | Verify the production bundle. |

## Requirements

- Node.js 18 or 20 (CRA 5 is legacy; newer versions may need `NODE_OPTIONS=--openssl-legacy-provider`).
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for the frontend.

## Environment

- No environment variables are used yet. The JWT key and API URL are hardcoded and should become configuration.
- Never commit real credentials or tokens.

## Architecture

- `frontend/src/App.js` — route tree, loaders, and actions.
- `frontend/src/helpers/` — token storage, auth guard, token duration.
- `frontend/src/pages/Authentication.js` — login/signup action.
- `backend/routes/auth.js` — signup and login endpoints.
- `backend/util/auth.js` — JWT signing, verification, and auth middleware.
- `backend/routes/events.js` — event CRUD protected by `checkAuth`.

## Commands and build order

- Run both servers; the SPA cannot authenticate or load events without the API.
- `cd frontend && npm run build` is the production gate.
- CRA tests watch by default; use `CI=true npm test` for a single run.

## Conventions and gotchas

- The backend must run before the frontend performs any auth or event request.
- Changing the JWT key invalidates every existing token.
- Router loaders run before the route renders; redirects must be returned, not thrown as strings.
- CRA inlines `REACT_APP_*` variables at build time; restart after changing them.
- The auth token is read from `localStorage`; clearing site data logs the user out.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
