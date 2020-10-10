module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',

  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  globals: {
    // "wx": "readonly",
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-control-statements/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-control-statements',
    'prettier',
  ], // 注意顺序
  rules: {
    'prettier/prettier': 2,
    'no-extra-semi': 0,
    quotes: ['error', 'single'],
    'no-unused-vars': 0,
  },
};
