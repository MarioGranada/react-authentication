# React Authentication — Working Memory

_Last updated: 2026-11-02_

## Current status

- Signup, login, logout, protected routes, and event CRUD work against the local API.
- JWT issuing/verification and bcrypt hashing are implemented.
- No tests or deployment workflow yet.

## Key decisions

- Used React Router loaders/actions so auth and data work stay outside components.
- Kept JSON persistence to match the course and avoid a database dependency.

## Known limitations and follow-ups

- Hardcoded JWT key and API URLs.
- Token in `localStorage` with no refresh flow.
- JSON files are not durable or multi-user safe.
- No rate limiting, email verification, or password reset.

## Mistakes to avoid

- Starting only the frontend makes login fail silently from the user’s perspective.
- A changed JWT key invalidates all existing sessions.
- Forgetting the `Authorization` header on a mutation returns a 401.
- CRA test runs watch unless `CI=true` is set.

## Next steps

- Move the JWT key and API URL into environment variables.
- Add refresh tokens or switch to httpOnly cookies.
- Replace JSON files with a real database.
- Add tests for the auth routes and route guards.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
