import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
    globals: true,
    environment: 'node',

    include: ['src/**/*.int.test.ts'],

    exclude: ['**/node_modules/**', '**/dist/**'],

    // Enable parallel execution with multiple workers
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4, // 4 workers = 4 database schemas
      },
    },

    // Global setup/teardown runs once per worker
    globalSetup: './test/integration/global-setup.ts',

    // Integration tests may need longer timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
