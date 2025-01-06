const { resolve } = require('path');

const project = resolve(__dirname, 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/react-internal.js', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: { project },
  settings: {
    'import/resolver': {
      typescript: { project },
    },
  },
  ignorePatterns: ['postcss.config.mjs', 'prettier.config.mjs', 'tailwind.config.ts'],
  rules: {
    'no-redeclare': 'off',
  },
};
