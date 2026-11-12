// Usage (from backend/): npm run db:migrate | npm run db:reset
// Needs POSTGRES_URL(_NON_POOLING) in ../.env.local (vercel env pull .env.local).
const { applySeed } = require('../db/seed');

const command = process.argv[2];
if (!['migrate', 'reset'].includes(command)) {
  console.error('Usage: node scripts/db.js <migrate|reset>');
  process.exit(1);
}

// Prefer the direct (non-pooled) connection for DDL.
if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
}
const { sql } = require('../db');

applySeed(sql, { reset: command === 'reset' })
  .then(() => console.log(command === 'reset' ? 'Reset demo data to the seed.' : 'Applied the schema + seed (db/sql.js).'))
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => sql.end());
