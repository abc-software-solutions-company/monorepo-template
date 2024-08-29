/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['only-warn', '@typescript-eslint', 'simple-import-sort', 'import'],
  globals: {
    React: true,
    JSX: true
  },
  env: {
    node: true
  },
  ignorePatterns: ['.*.js', 'node_modules/', 'dist/', 'build/'],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }]
};
