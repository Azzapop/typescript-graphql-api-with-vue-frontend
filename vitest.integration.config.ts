import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
    globals: true,
    environment: 'node',
    envFile: '.env.test',

    include: ['src/**/*.int.test.ts'],

    exclude: ['**/node_modules/**', '**/dist/**'],

    // Sequential execution in single process
    // All tests use the same database schema and run one at a time
    // This is simpler than parallel execution and fast enough for current test count
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Global setup/teardown runs once before/after all tests
    globalSetup: './test/integration/global-setup.ts',

    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
