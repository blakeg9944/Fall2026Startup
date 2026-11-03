import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // During development Vite serves the frontend on port 5173.
      // Requests that start with /api are forwarded to the Express service on port 4000.
      '/api': 'http://localhost:4000',
    },
  },
});
