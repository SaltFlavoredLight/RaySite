import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa', // Disables SPA history API fallback and returns 404 for unknown routes
  // ...other options
});
