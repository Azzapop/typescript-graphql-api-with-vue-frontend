import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
    globals: true,
    environment: 'node',

    include: ['src/**/*.integration.test.ts'],

    exclude: ['**/node_modules/**', '**/dist/**'],

    pool: 'threads',

    // Integration tests may need longer timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
