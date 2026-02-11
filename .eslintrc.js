/* eslint-env node */
module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    // 允许 console（开发环境需要）
    'no-console': 'off',
    // 未使用变量：仅警告，args 和 varsIgnorePattern 放宽
    'no-unused-vars': ['warn', {
      args: 'none',
      varsIgnorePattern: '^_'
    }],
    // 关闭 require 相关警告（小程序使用 CommonJS）
    'global-require': 'off',
    'no-undef': ['error', { typeof: true }]
  },
  globals: {
    wx: 'readonly',
    Page: 'readonly',
    App: 'readonly',
    getApp: 'readonly',
    Component: 'readonly',
    getCurrentPages: 'readonly',
    require: 'readonly',
    module: 'readonly',
    exports: 'writable'
  }
}
