const { resolve } = require('path');

const project = resolve(__dirname, 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/vite.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: { project },
  settings: {
    'import/resolver': {
      typescript: { project },
    },
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'playwright.config.ts',
    'postcss.config.mjs',
    'prettier.config.mjs',
    'tailwind.config.ts',
    'vite.config.ts',
    'vitest.config.ts',
  ],
};
