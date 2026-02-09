// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      viteMockServe({
        mockPath: 'mock', // mock 文件存放目录
        enable: command === 'serve', // 开发环境启用
        watchFiles: true, // 监听文件变化自动重启
        logger: true, // 在控制台显示请求日志

        // 可选：生产环境可以禁用或开启
        prodEnabled: false, // 生产环境禁用

        // 可选：注入代码到 main.ts
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
      }),
    ],
    server: {
      port: 3000,
      open: true, // 自动打开浏览器
      cors: true, // 允许跨域
      // 如果你有真实后端，proxy 才会生效
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          // 仅在 target 不是空字符串时重写
          rewrite: path => path.replace(/^\/api/, env.VITE_API_BASE_URL ? '' : '/api'),
        },
      },
    },
    // 确保 resolve 配置不会影响 mock
    resolve: {
      alias: {
        '@': '/src', // 如果有别名配置
      },
    },
  }
})
