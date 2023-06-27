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
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // React17から不要になった import React from 'react'; に対応
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // 不適切な依存配列の検知
    'react-hooks/exhaustive-deps': 'warn',
  },
};
