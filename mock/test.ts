// mock/test.ts
import { type MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/test',
    method: 'get',
    response: () => {
      console.log('✅ Mock /api/test 被调用')
      return {
        code: 200,
        message: 'Mock服务正常',
        timestamp: Date.now(),
      }
    },
  },
] as MockMethod[]
