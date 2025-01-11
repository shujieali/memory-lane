const js = require('@eslint/js');

module.exports = [{
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
    globals: {
      ...js.configs.recommended.globals,
      __dirname: 'readonly',
      __filename: 'readonly',
      process: 'readonly',
      module: 'readonly',
      require: 'readonly',
      exports: 'writable',
      console: 'readonly',
    },
  },
  rules: {
    ...js.configs.recommended.rules,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['info', 'error', 'log'] }],
  },
}];
