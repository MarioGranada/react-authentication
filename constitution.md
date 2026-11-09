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
| Frontend | React 18 (Create React App 5) | The course project is a CRA SPA. |
| Routing | React Router 6 data APIs | Loaders, actions, and protected routes keep data work outside components. |
| Backend | Express 4 | A small API demonstrates token issuing and verification. |
| Auth | jsonwebtoken 8 + bcryptjs | JWT sessions and password hashing without a database. |
| Persistence | JSON files | Users and events are stored locally for the course. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project for learning client/server authentication with JWTs. It is not a production identity system: it lacks refresh tokens, httpOnly cookies, rate limiting, and a real database.

### 2. Environment Isolation

- This project has no runtime secrets. Do not introduce `.env` files unless a real secret or environment-specific URL appears.
- If configuration is added, use environment variables and document them in the README.
- Never commit keys, tokens, database URLs, or credentials.

### 3. Architecture

- Auth helpers live in `frontend/src/helpers/`; pages and components should not read `localStorage` directly.
- Router loaders/actions own data fetching and mutations.
- Backend auth logic stays in `util/auth.js`; routes compose it rather than reimplementing verification.

### 4. Data and State

- The backend JSON files are the source of truth for users and events.
- The client stores only the JWT and derives auth state from it.
- Passwords are never returned to the client; only the token and user summary are sent.

### 5. Styling and UX

- CRA global styles and CSS Modules live with their components.
- Keep form errors visible and associated with the relevant field.
- Do not add a UI library for this course project.

### 6. Quality Gates

- `cd frontend && npm run build` is the main gate.
- Manually test signup, duplicate email, short password, login, wrong password, protected route redirect, create, edit, delete, logout, and an expired token.
- Confirm the API rejects mutations without a valid token.

### 7. Deployment

- Frontend: static CRA build for GitHub Pages.
- Backend: a Node host or Supabase Auth plus a hosted database.
- Move the JWT key and API URL into environment variables before any deployment.

## What to Avoid

- Shipping the hardcoded JWT key to production.
- Storing tokens in `localStorage` for a production app without acknowledging XSS risk.
- Trusting client-side route guards as the only authorization check.
- Committing user data or JSON files containing real accounts.
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
