module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', '@emotion'],
  rules: {
    // React17から不要になった import React from 'react'; に対応
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    // 不適切な依存配列の検知
    'react-hooks/exhaustive-deps': 'warn',
    // emotion11関連
    '@emotion/jsx-import': 'error',
    '@emotion/pkg-renaming': 'error',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^jsx$' }],
  },
  ignorePatterns: ['build/', 'src--jsx/', 'public/', '**/node_modules/', '*.config.js', '.*lintrc.js', '/*.*'],
};
