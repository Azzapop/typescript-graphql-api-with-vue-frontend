import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

// Load .env.test before anything else
config({ path: '.env.test' });

// Set DATABASE_URL with schema parameter before any Prisma clients are created
// This ensures the global Prisma client (used by stores) uses the test schema
const baseUrl = process.env.DATABASE_URL;
process.env.DATABASE_URL = `${baseUrl}?schema=test_schema`;
console.log('[Integration Tests] DATABASE_URL configured for schema: test_schema');

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
    globals: true,
    environment: 'node',

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

    // Integration tests may need longer timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
