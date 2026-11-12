// Local development server. On Vercel, the "backend" service serves app.js.
const app = require('./app');

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API listening on http://localhost:${port}/api`));
