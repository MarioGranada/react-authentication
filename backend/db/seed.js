const { migration, reset } = require('./sql');

// Applies the idempotent schema + seed. With { reset: true } it first empties
// the demo tables, so the seed is restored. Everything runs in one transaction.
async function applySeed(sql, { reset: doReset = false } = {}) {
  const text = (doReset ? reset + '\n' : '') + migration;
  await sql.begin((tx) => tx.unsafe(text).simple());
}

module.exports = { applySeed };
