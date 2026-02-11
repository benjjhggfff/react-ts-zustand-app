// src/utils/request.ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios'
import { TIME_OUT } from './config'
import Message from '../utils/Massagee' // 修正笔误：Massagee → Message

// ========== 自定义类型定义 ==========
interface RequestInterceptors {
  requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestFailureFn?: (err: AxiosError) => Promise<AxiosError>
  responseSuccessFn?: (res: AxiosResponse) => any
  responseFailureFn?: (err: AxiosError) => Promise<AxiosError>
}

// 仅扩展 interceptors，继承 InternalAxiosRequestConfig 原生属性（headers 为可选，无需重复声明）
interface HYRequestConfig extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors
}

// ========== 网络请求封装类 ==========
class HYRequest {
  private instance: AxiosInstance

  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config)

    // 全局请求拦截器（自动添加 ngrok 头）
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['ngrok-skip-browser-warning'] = 'true'
        // 获取 token
        const token = localStorage.getItem('token') //  // 添加 token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (err: AxiosError) => Promise.reject(err)
    )

    // 全局响应拦截器（401自动重登）
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => res,
      (err: AxiosError) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          Message.error('登录已过期，请重新登录！')
          setTimeout(() => (window.location.href = '/login'), 2000)
        }
        return Promise.reject(err)
      }
    )

    // 实例自定义拦截器
    if (config.interceptors) {
      const { requestSuccessFn, requestFailureFn, responseSuccessFn, responseFailureFn } =
        config.interceptors
      if (requestSuccessFn) {
        this.instance.interceptors.request.use(
          requestSuccessFn,
          requestFailureFn || (err => Promise.reject(err))
        )
      }
      if (responseSuccessFn) {
        this.instance.interceptors.response.use(
          responseSuccessFn,
          responseFailureFn || (err => Promise.reject(err))
        )
      }
    }
  }

  // 【核心修改】参数改为 Partial<HYRequestConfig>，支持部分配置，默认值为 {} 避免空值
  request<T = any>(config: Partial<HYRequestConfig> = {}): Promise<T> {
    // 处理自定义请求拦截器（兼容 config 可能为空的情况）
    if (config.interceptors?.requestSuccessFn) {
      try {
        // 类型断言为完整配置，确保拦截器逻辑正常
        config = config.interceptors.requestSuccessFn(config as InternalAxiosRequestConfig)
      } catch (err) {
        console.error('请求拦截器失败:', err)
      }
    }
    return new Promise((resolve, reject) => {
      this.instance
        .request(config as InternalAxiosRequestConfig) // 类型断言，兼容 axios 内部类型
        .then((res: AxiosResponse) => {
          let data = res.data
          if (config.interceptors?.responseSuccessFn) {
            try {
              data = config.interceptors.responseSuccessFn(res)
            } catch (err) {
              console.error('响应拦截器失败:', err)
            }
          }
          resolve(data as T)
        })
        .catch((err: AxiosError) => {
          console.error('请求失败:', err)
          reject(err)
        })
    })
  }

  // 【同步修改】所有快捷方法参数也改为 Partial<HYRequestConfig>
  get<T = any>(config: Partial<HYRequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T = any>(config: Partial<HYRequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  delete<T = any>(config: Partial<HYRequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: Partial<HYRequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

// ========== 创建全局请求实例（逻辑不变，自动携带Token） ==========
const Request = new HYRequest({
  baseURL: '/api',
  timeout: TIME_OUT,
  headers: {} as AxiosRequestHeaders,
  interceptors: {
    requestSuccessFn: (config: InternalAxiosRequestConfig) => {
      // 免Token接口（登录/注册）
      const noTokenUrls = ['/login', '/register']
      const url = config.url ?? ''
      if (noTokenUrls.some(item => url.includes(item))) return config

      // 自动携带Token
      const token = localStorage.getItem('token')
      if (token) config.headers.token = token
      return config
    },
  },
})

export default Request
export type { HYRequestConfig, RequestInterceptors }
