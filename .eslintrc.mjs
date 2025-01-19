import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'

export default [
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json', './tsconfig.node.json'],
      },
      globals: {
        ...js.configs.recommended.globals,
        React: true,
        JSX: true,
        console: true,
        document: true,
        window: true,
        navigator: true,
        localStorage: true,
        fetch: true,
        Response: true,
        Headers: true,
        HeadersInit: true,
        HTMLElement: true,
        HTMLImageElement: true,
        setTimeout: true,
        global: true,
        // Test globals
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-refresh': reactRefreshPlugin,
      'react-hooks': reactHooksPlugin,
      react: reactPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-prototype-builtins': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
