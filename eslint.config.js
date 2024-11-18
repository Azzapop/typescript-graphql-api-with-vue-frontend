import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// TODO add linting for what imports/exports are allowed
// esint-plugin-import not supporting flat-config yet
// https://github.com/import-js/eslint-plugin-import/issues/2556

export default [
  {
    ignores: ['**/services'],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
    files: ['**/*.ts', '*.vue', '**/*.vue'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
      'func-style': ['error', 'expression'],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: true,
            object: true,
          },
          AssignmentExpression: {
            array: true,
            object: true,
          },
        },
        {
          enforceForRenamedProperties: true,
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  ...vuePlugin.configs['flat/essential'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  }
];
