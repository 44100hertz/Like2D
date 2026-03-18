import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  server: {
    watch: {
      ignored: ['!**/like/**']
    }
  },
  optimizeDeps: {
    exclude: ['like']
  }
});