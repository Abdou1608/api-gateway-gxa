/**
 * ESLint configuration for the API Gateway (TypeScript + Node 20).
 *
 * Key policy: centralize error handling — forbid local res.status/json/send calls inside catch blocks.
 */
module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // Disable type-aware linting to avoid tsconfig scope issues for tests
    // (we can introduce a dedicated tsconfig.eslint.json later if needed)
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {},
  rules: {
    // Hygiene
    'no-console': 'off',
    'prefer-const': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Import order
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      },
    ],
    // Avoid resolver noise without the TS resolver dependency
    'import/no-unresolved': 'off',
    'import/export': 'off',

    // Centralized error policy moved to a routes-only override below
    'no-restricted-syntax': 'off',

    // Relax a few TS rules to avoid blocking on legacy code; we can re-enable incrementally
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    'no-extra-semi': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-useless-escape': 'warn',
    'no-inner-declarations': 'off',
  },
  overrides: [
    // Enforce centralized error policy only in routes
    {
      files: ['src/routes/**/*.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "CatchClause CallExpression[callee.type='MemberExpression'][callee.object.type='Identifier'][callee.object.name=/^(res|response)$/][callee.property.type='Identifier'][callee.property.name=/^(status|json|send)$/]",
            message:
              'Do not send responses in catch blocks. Throw a typed error and delegate to the global error handler.',
          },
        ],
      },
    },
    // Tests: allow response handling for assertions/mocks
    {
      files: ['**/*.test.ts', 'tests/**/*.ts'],
      rules: {
        'no-restricted-syntax': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-namespace': 'off',
      },
    },
    // Central error handler is the only place allowed to respond in error paths
    {
      files: ['src/middleware/error-handler.ts'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'scripts/backup/',
    '*.d.ts',
  ],
};
