import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
  test: {
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
        '**/stores/**',
        '**/resolvers/**',
        '**/routes/**',
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

    pool: 'threads',
  },
});
