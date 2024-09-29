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
          Painter: 'Omit<GqlPainter, "techniques">',
          Painting: 'Omit<GqlPainting, "painter" | "technique">',
        },
      },
    },
    'src/services/graphql/validations.ts': {
      plugins: ['typescript', 'typescript-validation-schema'],
      config: {
        schema: 'zod',
      },
    },
  },
};

export default config;
