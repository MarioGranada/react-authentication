const express = require('express');

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const cronRoutes = require('./routes/cron');

const app = express();

app.use(express.json());

// Everything lives under /api: on Vercel the SPA and the API share one origin,
// and in development Vite proxies /api to this server.
const api = express.Router();
api.use(authRoutes); // POST /api/signup, POST /api/login
api.use('/events', eventRoutes);
api.use('/cron', cronRoutes);
api.use((req, res) => res.status(404).json({ message: 'Not found.' }));
app.use('/api', api);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  // Never send database errors to the browser.
  res.status(status).json({ message: status >= 500 ? 'Something went wrong.' : error.message });
});

module.exports = app;
