import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: './',
  plugins: [tsconfigPaths()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    target: 'ES2022',
  },
});
