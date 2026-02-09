// mock/index.ts
import { MockMethod } from 'vite-plugin-mock'
import userMock from './user'

export default [
  ...userMock,
  // 可以在这里添加其他模块的 mock
] as MockMethod[]
