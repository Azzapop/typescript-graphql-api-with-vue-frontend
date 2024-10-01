import type { CodegenConfig } from '@graphql-codegen/cli';

// TODO operations with the query fragments

const config: CodegenConfig = {
  schema: './src/modules/graphql/type-defs.graphql',
  documents: './src/modules/client/**/*.ts',
  hooks: {
    // afterAllFileWrite: ['prettier --write', 'eslint --fix'],
  },
  config: {
    avoidOptionals: true,
    enumsAsTypes: true,
  },
  generates: {
    'src/modules/graphql/types.generated.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        typesPrefix: 'Gql',
        mappers: {
          Painter: 'Omit<GqlPainter, "techniques">',
          Painting: 'Omit<GqlPainting, "painter" | "technique">',
        },
      },
    },
    'src/modules/graphql/validations.generated.ts': {
      plugins: ['typescript', 'typescript-validation-schema'],
      config: {
        schema: 'zod',
      },
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: { extension: '.generated.tsx', baseTypesPath: 'modules/graphql/types.generated.ts' },
      plugins: ['typescript-operations', 'typescript-urql'],
      config: { withHooks: true },
    },
  },
};

export default config;
