import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  resolve: {
    alias: [
      { find: 'like2d', replacement: '/home/sam/code/games/like2d/packages/like2d/src/index.ts' },
      { find: 'like2d/callback', replacement: '/home/sam/code/games/like2d/packages/like2d/src/adapters/callback/index.ts' },
      { find: 'like2d/scene', replacement: '/home/sam/code/games/like2d/packages/like2d/src/adapters/scene/index.ts' },
    ],
  },
});
