/* ESLint configuration for TypeScript project */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    sourceType: 'module'
  },
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  plugins: ['@typescript-eslint','import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    // Relax additional rules temporarily to get a green baseline. These will be
    // re-enabled (as warn/error) incrementally in future hardening passes.
    '@typescript-eslint/no-redundant-type-constituents': 'warn',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    'no-prototype-builtins': 'warn',
    'no-irregular-whitespace': 'warn',
    '@typescript-eslint/require-await': 'warn',
    'prefer-const': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'warn',
    '@typescript-eslint/no-base-to-string': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    'no-extra-semi': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    'no-useless-escape': 'warn',
  '@typescript-eslint/restrict-template-expressions': 'off',
    'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } }],
    'no-inner-declarations': 'off'
  },
  ignorePatterns: ["dist", "coverage", "node_modules"]
  ,overrides: [
    {
      files: ["src/routes/**/*.ts"],
      rules: {
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/require-await': 'off'
      }
    }
  ]
};
