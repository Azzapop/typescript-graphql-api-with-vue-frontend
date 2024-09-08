import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/type-defs.graphql',
  documents: './src/client/**/*.ts',
  config: {
    avoidOptionals: true,
    enumsAsTypes: true,
  },
  generates: {
    'src/services/graphql/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;
