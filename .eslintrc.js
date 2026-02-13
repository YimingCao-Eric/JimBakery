/**
 * ESLint 配置文件
 * 用于微信小程序项目的代码检查与规范
 */
/* eslint-env node */
module.exports = {
  // 标记为根配置，停止向上查找父级 .eslintrc，避免被外层配置覆盖
  root: true,
  // 继承 eslint 推荐规则集
  extends: ['eslint:recommended'],
  // 代码运行环境
  env: {
    es6: true,   // 启用 ES6 语法（如 let、const、箭头函数）
    node: true   // 启用 Node 全局（如 __dirname、module）
  },
  // 解析器选项
  parserOptions: {
    ecmaVersion: 2020,   // 支持的 ECMAScript 版本（支持可选链 ?. 等）
    sourceType: 'module' // 模块类型，module 为 ES Module，script 为传统脚本
  },
  rules: {
    // 允许 console：小程序开发调试需要打印日志
    'no-console': 'off',
    // 未使用变量：仅警告，便于逐步清理
    'no-unused-vars': ['warn', {
      args: 'none',              // 函数参数未使用不报错
      varsIgnorePattern: '^_'     // 以下划线开头的变量视为有意保留，如 _unused
    }],
    // 关闭 require 必须在顶层的要求（小程序常在函数内 require）
    'global-require': 'off',
    // 未定义变量报错；typeof 检测的变量允许未定义（如 typeof wx）
    'no-undef': ['error', { typeof: true }]
  },
  // 全局变量声明，避免 ESLint 报 "未定义" 错误
  // 微信小程序运行时会注入这些全局对象
  globals: {
    wx: 'readonly',           // 微信 API 对象
    Page: 'readonly',         // 页面注册函数
    App: 'readonly',          // 应用注册函数
    getApp: 'readonly',       // 获取 App 实例
    Component: 'readonly',     // 组件注册函数
    getCurrentPages: 'readonly',  // 获取当前页面栈
    require: 'readonly',      // CommonJS 加载
    module: 'readonly',       // CommonJS 模块对象
    exports: 'writable'       // 模块导出，需可写
  }
}
