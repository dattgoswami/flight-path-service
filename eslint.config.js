import { Linter } from 'eslint';
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
];
