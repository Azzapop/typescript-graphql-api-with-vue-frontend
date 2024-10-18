import type { CodegenConfig } from '@graphql-codegen/cli';

const addEslintDisable = { add: { content: '/* eslint-disable */' } };
const typesPrefix = { typesPrefix: 'Gql' };

const config: CodegenConfig = {
  schema: './src/modules/graphql/type-defs.graphql',
  documents: './src/modules/client/**/!(*.gql).ts',
  hooks: {
    afterAllFileWrite: ['prettier --write', 'eslint --fix'],
  },
  config: {
    avoidOptionals: true,
    enumsAsTypes: true,
    ...typesPrefix,
  },
  generates: {
    'src/libs/graphql-types/index.ts': {
      plugins: [addEslintDisable, 'typescript', 'typescript-resolvers'],
      config: {
        mappers: {
          Painter: 'Omit<GqlPainter, "techniques">',
          Painting: 'Omit<GqlPainting, "painter" | "technique">',
        },
      },
    },
    'src/libs/graphql-validators/index.ts': {
      plugins: [addEslintDisable, 'typescript-validation-schema'],
      config: {
        schema: 'zod',
        importFrom: '@libs/graphql-types',
        withObjectType: true,
        // TODO switch back to `const` when issue resolved
        // https://github.com/Code-Hex/graphql-codegen-typescript-validation-schema/issues/528
        validationSchemaExportType: 'function',
        mappers: {
          Painter: 'Omit<GqlPainter, "techniques">',
          Painting: 'Omit<GqlPainting, "painter" | "technique">',
        },
      },
    },
    'src/modules/client/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.gql.ts',
        baseTypesPath: '~@libs/graphql-types',
      },
      plugins: [addEslintDisable, 'typescript-operations'],
      config: {
        onlyOperationTypes: true,
        withHooks: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
