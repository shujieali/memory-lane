import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  esbuild: {
    target: 'esnext',
  }
});
