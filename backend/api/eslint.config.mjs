import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';

// TODO config broken
// TODO add prefer destructuring

export default [
  {
    languageOptions: { globals: globals.browser },
    files: ['**/*.ts'],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "prefer-destructuring": ["error", {
        "VariableDeclarator": {
          "array": true,
          "object": true
        },
        "AssignmentExpression": {
          "array": true,
          "object": true
        }
      }, {
          "enforceForRenamedProperties": true
        }]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  jest.configs['flat/recommended'],
];
