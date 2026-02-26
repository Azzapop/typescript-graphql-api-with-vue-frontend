import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'unit',
      globals: true,
      environment: 'node',


      include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],

      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.int.test.ts',
        '**/*.e2e.test.ts',
        '**/*.gql.ts',
      ],

      // Sequential execution — repository tests use a shared database schema
      // and cannot safely run in parallel (TRUNCATE CASCADE between tests)
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },

      globalSetup: './test/global-setup.ts',
      setupFiles: ['./test/setup-fabbrica.ts'],

      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],

        include: [
          'src/libs/**/!(*.test|*.spec).ts',
          'src/modules/**/!(*.test|*.spec).ts',
        ],

        exclude: [
          '**/index.ts',
          '**/*-types.ts',
          '**/*-const.ts',
          '**/*-config.ts',
          '**/graphql-types/**',
          '**/graphql-validators/**',
          '**/prisma-validators/**',
          '**/packages/**',
          '**/*.test.ts',
          '**/*.spec.ts',
        ],

        thresholds: {
          lines: 85,
          functions: 85,
          branches: 80,
          statements: 85,
        },
      },
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      name: 'integration',
      globals: true,
      environment: 'node',


      include: ['src/**/*.int.test.ts', 'test/integration/**/*.int.test.ts'],

      exclude: ['**/node_modules/**', '**/dist/**'],

      // Sequential execution in single process
      // All tests use the same database schema and run one at a time
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },

      globalSetup: './test/global-setup.ts',
      setupFiles: ['./test/setup-fabbrica.ts'],

      testTimeout: 30000,
      hookTimeout: 30000,
    },
  },
]);
