import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3005,
    strictPort: true,
  },
  build: {
    outDir: 'build',
  },
});
