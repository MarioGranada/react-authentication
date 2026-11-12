const postgres = require('postgres');

// One lazily created Postgres client per server instance (or Vercel function).
// POSTGRES_URL is injected by the Supabase <-> Vercel integration and points at
// Supabase's transaction pooler, which does not support prepared statements.
let client;

function createClient() {
  const raw = process.env.POSTGRES_URL;
  if (!raw) {
    throw new Error('POSTGRES_URL is not set. Run `vercel env pull .env.local` in the repo root.');
  }
  const url = new URL(raw);
  const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
  url.search = ''; // drop provider-specific query params; SSL is configured below
  return postgres(url.toString(), {
    ssl: isLocal ? false : 'require',
    prepare: false,
    max: 5,
    idle_timeout: 20,
    onnotice: () => {},
  });
}

function getClient() {
  if (!client) client = createClient();
  return client;
}

// `sql` behaves like the postgres.js client but connects on first use, so
// importing this module never fails when the env var is missing.
const sql = new Proxy(function () {}, {
  apply: (_target, _this, args) => getClient()(...args),
  get: (_target, prop) => {
    const c = getClient();
    const value = c[prop];
    return typeof value === 'function' ? value.bind(c) : value;
  },
});

module.exports = { sql };
