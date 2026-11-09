# React Authentication

A full-stack events app used to practise authentication in React. Users can sign up, log in, browse events, and create, edit, or delete events; only authenticated users can reach the mutation routes.

The frontend is a Create React App SPA using React Router data APIs. The backend is a small Express server that hashes passwords with bcrypt, issues one-hour JWTs, and stores users and events in JSON files.

> **Follow-along project.** This app was built while following **React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Features

- Signup and login forms with server-side validation.
- Passwords hashed with bcrypt before storage.
- JWT authentication with a one-hour expiry.
- Token persisted in `localStorage` and attached to protected requests.
- Protected routes enforced by router loaders.
- Event list, detail, create, edit, and delete flows.
- Logout action that clears the token.
- Shared error handling for auth and API failures.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 (Create React App 5) |
| Routing | React Router 6 data APIs |
| Backend | Express 4 |
| Auth | jsonwebtoken 8 + bcryptjs |
| Persistence | JSON files |

## Project structure

```text
react-authentication/
├── backend/
│   ├── app.js                 # Express app (port 8080)
│   ├── routes/auth.js         # /signup and /login
│   ├── routes/events.js       # Event CRUD with auth checks
│   ├── data/                  # user.js, event.js, util.js
│   ├── util/auth.js           # JWT create/verify, bcrypt compare, middleware
│   ├── util/validation.js
│   └── events.json
├── frontend/
│   ├── src/
│   │   ├── pages/             # Authentication, Events, EventDetail, Edit, New, Logout
│   │   ├── components/        # AuthForm, EventForm, lists, navigation
│   │   ├── helpers/           # token storage, loaders, duration
│   │   └── App.js             # Router configuration
│   └── package.json
└── README.md
```

## Getting started

### Requirements

- Node.js 18 or 20 (CRA 5 is legacy; newer versions may need `NODE_OPTIONS=--openssl-legacy-provider`).
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for the frontend.

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Run locally

**Start the backend API**

```bash
cd backend && npm start
```

Open http://localhost:8080.

The API has no CORS restriction beyond allowing all origins.

**Start the frontend**

```bash
cd frontend && npm start
```

Open http://localhost:3000.

Both servers must be running; the frontend calls `http://localhost:8080` directly.

### Available scripts

| Command | Description |
| --- | --- |
| `cd backend && npm start` | Start the Express API on port 8080. |
| `cd frontend && npm start` | Start CRA on port 3000. |
| `cd frontend && npm run build` | Create a production frontend build. |
| `cd frontend && npm test` | Run the CRA test runner. |

## How it works

`frontend/src/App.js` builds the router. The root route runs `tokenLoader`, which reads the token from `localStorage`, so every route can inspect auth state through `useRouteLoaderData("root")`.

`checkAuthLoader` guards the new-event and edit-event routes and redirects unauthenticated users to `/auth`. The `Authentication` page action posts to `/login` or `/signup`, stores the returned token, and navigates home.

`getAuthToken` and the token helpers centralise storage access and expiry handling. `Logout` removes the token and redirects.

`EventForm` and the event pages use router actions for POST, PATCH, and DELETE. Protected requests attach `Authorization: Bearer <token>`.

On the backend, `routes/auth.js` validates input, checks for an existing email, hashes the password with bcrypt, and returns a JWT. `util/auth.js` verifies tokens in `checkAuth`, which guards event mutations.

## Deployment

- Target: GitHub Actions can build the CRA frontend and publish `build/` to GitHub Pages.
- The Express API needs a Node host, or replacement with Supabase Auth and a hosted database. JSON files are not durable.
- Replace the hardcoded `http://localhost:8080` URLs and the JWT signing key with environment variables before deploying.
- Because the token is stored in `localStorage`, any XSS becomes a session compromise; a production app should prefer httpOnly cookies.

## Notes and limitations

- The JWT signing key is hardcoded as `supersecret` in `backend/util/auth.js`. This is a demo-only choice and must be moved to an environment variable.
- The token is stored in `localStorage`, so it is readable by JavaScript.
- There is no refresh-token flow; tokens expire after one hour and the user must log in again.
- Users and events are JSON files on the API machine, not a database.
- CORS allows every origin.

---

**Author:** Mario Granada
