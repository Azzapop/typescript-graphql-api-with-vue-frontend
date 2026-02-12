import type { CodegenConfig } from '@graphql-codegen/cli';

const ADD_ESLINT_DISABLE = { add: { content: '/* eslint-disable */' } };
const TYPES_PREFIX = { typesPrefix: 'Gql' };

const config: CodegenConfig = {
  schema: './src/modules/graphql/type-defs.graphql',
  documents: './src/modules/client/**/!(*.gql).ts',
  hooks: {
    afterAllFileWrite: ['prettier --write', 'eslint --fix'],
  },
  config: {
    avoidOptionals: true,
    enumsAsTypes: true,
    ...TYPES_PREFIX,
  },
  generates: {
    'src/libs/graphql-types/index.ts': {
      plugins: [ADD_ESLINT_DISABLE, 'typescript', 'typescript-resolvers'],
    },
    'src/libs/graphql-validators/index.ts': {
      plugins: [ADD_ESLINT_DISABLE, 'typescript-validation-schema'],
      config: {
        schema: 'zod',
        importFrom: '~libs/graphql-types',
        withObjectType: true,
        // TODO switch back to `const` when issue resolved
        // https://github.com/Code-Hex/graphql-codegen-typescript-validation-schema/issues/528
        validationSchemaExportType: 'function',
      },
    },
    'src/modules/client/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.gql.ts',
        baseTypesPath: '~~libs/graphql-types',
      },
      plugins: [ADD_ESLINT_DISABLE, 'typescript-operations'],
      config: {
        onlyOperationTypes: true,
        withHooks: true,
        useTypeImports: true,
      },
    },
  },
};

export default config;
