import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

const files = ['**/*.{js,jsx}']

export default [
  { ignores: ['dist'] },
  {
    files,
    plugins: { 'react-hooks': { rules: reactHooks.rules } },
    rules: reactHooks.configs['recommended-latest'].rules,
  },
  {
    files,
    plugins: { 'react-refresh': { rules: reactRefresh.rules } },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files,
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]
