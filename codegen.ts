import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/type-defs.graphql',
  documents: './src/client/**/*.ts',
  hooks: {
    afterAllFileWrite: ['prettier --write', 'eslint --fix'],
  },
  config: {
    avoidOptionals: true,
    enumsAsTypes: true,
  },
  generates: {
    'src/services/graphql/types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-resolvers'],
      config: {
        typesPrefix: 'Gql',
        mappers: {
          Painter: 'Pick<GqlPainter, "name" | "country">',
        },
      },
    },
  },
};

export default config;
