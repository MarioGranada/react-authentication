import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Same-origin /api in development, like production on Vercel.
    proxy: { '/api': 'http://localhost:8080' },
  },
  preview: { port: 3000, proxy: { '/api': 'http://localhost:8080' } },
  build: { outDir: 'dist' },
});
