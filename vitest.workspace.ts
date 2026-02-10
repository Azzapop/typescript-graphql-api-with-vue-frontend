import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'unit',
      include: ['src/**/*.test.ts'],
      exclude: ['**/*.int.test.ts', '**/*.e2e.test.ts'],
      setupFiles: ['./test/unit-setup.ts'],
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      name: 'integration',
      include: ['src/**/*.int.test.ts'],
      fileParallelism: false,
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      name: 'e2e',
      include: ['src/**/*.e2e.test.ts'],
      fileParallelism: false,
    },
  },
]);
