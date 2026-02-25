import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'node',
      envFile: '.env.test',

      include: ['src/**/*.int.test.ts'],
      passWithNoTests: true,

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
      setupFiles: ['./test/integration/setup-fabbrica.ts'],

      testTimeout: 30000,
      hookTimeout: 30000,
    },
  })
);
