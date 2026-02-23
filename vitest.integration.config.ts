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

    // TODO: Re-enable parallel execution after refactoring Prisma client injection
    // Currently using sequential execution due to module mocking limitations
    // See docs/INTEGRATION_TESTING_STRATEGY.md for parallelization plan
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Run all tests in single process sequentially
      },
    },

    // Global setup/teardown runs once per worker
    globalSetup: './test/integration/global-setup.ts',

    // Setup files run before each test file loads
    setupFiles: ['./test/integration/setup-test-env.ts'],

    // Integration tests may need longer timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
