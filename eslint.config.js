module.exports = {
  // 环境：浏览器 + ES6 + Node（适配Vite构建）
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // 解析器：适配TS
  parser: '@typescript-eslint/parser',
  // 解析器选项：指定TS版本、模块类型（ESModule）
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // 关联TS配置，校验类型
  },
  // 插件：React + TS + React Hooks
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
  ],
  // 规则集：继承官方推荐规则 + 解决Prettier冲突
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // 适配React 18+ JSX自动导入
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // 整合Prettier到ESLint
  ],
  // 自定义规则（可根据团队需求调整）
  rules: {
    // 关闭React默认的props类型检查（TS已做类型校验）
    'react/prop-types': 'off',
    // 允许未使用的变量（开发阶段临时注释代码时禁用）
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // 禁止console（生产环境可改为error）
    'no-console': 'warn',
    // React Refresh热更新相关：禁止默认导出（Vite React插件要求）
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Prettier规则优先级最高
    'prettier/prettier': 'error',
  },
  // 全局变量：适配React
  settings: {
    react: {
      version: 'detect', // 自动检测React版本
    },
  },
};