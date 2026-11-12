// Base URL of the Express API. The API is served from the same origin under
// /api (Vercel in production, the Vite dev proxy locally). VITE_API_URL can
// point the SPA at another API instead.
export const API_URL = import.meta.env.VITE_API_URL || '/api';
