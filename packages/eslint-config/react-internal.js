/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['only-warn', '@typescript-eslint', 'simple-import-sort', 'import'],
  globals: {
    React: true,
    JSX: true
  },
  env: {
    browser: true
  },
  ignorePatterns: ['.*.js', 'node_modules/', 'dist/', 'build/'],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }]
};
