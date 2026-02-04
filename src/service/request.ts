import axios, {
  type AxiosInstance,
 
   type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,        // 使用 type 关键字标记仅类型导入
} from 'axios';

import { TIME_OUT } from './config';
import Massage from '../utils/Massagee';

// ========== 自定义类型定义（核心修正） ==========
/**
 * 自定义拦截器类型（全局/单次请求）
 * 关键：请求拦截器参数改为 InternalAxiosRequestConfig（Axios v1.x 要求）
 */
interface RequestInterceptors {
  // 请求成功拦截：参数/返回值改为 InternalAxiosRequestConfig
  requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  // 请求失败拦截：必须返回 Promise（Axios 规范）
  requestFailureFn?: (err: AxiosError) => Promise<AxiosError>;
  // 响应成功拦截：入参是 AxiosResponse（全局拦截器未剥离前）
  responseSuccessFn?: (res: AxiosResponse) => any;
  // 响应失败拦截：必须返回 Promise
  responseFailureFn?: (err: AxiosError) => Promise<AxiosError>;
}

/**
 * 扩展Axios配置，添加自定义拦截器属性
 * 关键：继承 InternalAxiosRequestConfig 而非 AxiosRequestConfig
 */
interface HYRequestConfig extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors;
}

// ========== 网络请求封装类 ==========
class HYRequest {
  private instance: AxiosInstance;

  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config);

    // 全局请求拦截器（核心修正：config类型改为 InternalAxiosRequestConfig）
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 修复headers：强制初始化，避免undefined（解决类型报错核心）
        config.headers = config.headers || ({} as AxiosRequestHeaders);
        config.headers['ngrok-skip-browser-warning'] = 'true';
        return config;
      },
      (err: AxiosError) => {
        // 失败拦截器必须返回 Promise.reject
        return Promise.reject(err);
      }
    );

    // 全局响应拦截器（保留原有逻辑）
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data;
      },
      (err: AxiosError) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          Massage.error('登录已过期，请重新登录！');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        return Promise.reject(err);
      }
    );

    // 特定实例的自定义拦截器（修正失败回调默认值）
    if (config.interceptors) {
      const {
        requestSuccessFn,
        requestFailureFn,
        responseSuccessFn,
        responseFailureFn
      } = config.interceptors;

      // 请求拦截器：处理成功/失败回调
      if (requestSuccessFn) {
        this.instance.interceptors.request.use(
          requestSuccessFn,
          requestFailureFn || ((err) => Promise.reject(err)) // 默认失败处理
        );
      }

      // 响应拦截器：处理成功/失败回调
      if (responseSuccessFn) {
        this.instance.interceptors.response.use(
          responseSuccessFn,
          responseFailureFn || ((err) => Promise.reject(err)) // 默认失败处理
        );
      }
    }
  }

  /**
   * 通用请求方法封装（修正泛型和拦截器逻辑）
   */
  request<T = any>(config: HYRequestConfig): Promise<T> {
    // 单次请求的请求拦截处理（安全判断）
    if (typeof config.interceptors?.requestSuccessFn === 'function') {
      try {
        config = config.interceptors.requestSuccessFn(config);
      } catch (err) {
        console.error('单次请求拦截器执行失败:', err);
      }
    }

    return new Promise((resolve, reject) => {
      this.instance
        .request(config) // 移除多余泛型，让TS自动推导
        .then((res: T) => {
          // 单次请求的响应拦截处理
          if (typeof config.interceptors?.responseSuccessFn === 'function') {
            try {
              res = config.interceptors.responseSuccessFn(res) as T;
            } catch (err) {
              console.error('单次响应拦截器执行失败:', err);
            }
          }
          resolve(res);
        })
        .catch((err: AxiosError) => {
          reject(err);
          console.error('请求失败:', err);
        });
    });
  }

  // 以下HTTP方法保留原有逻辑，仅修正config类型
  get<T = any>(config: HYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T = any>(config: HYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  delete<T = any>(config: HYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }

  patch<T = any>(config: HYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }
}

// ========== 创建请求实例（修复headers赋值） ==========
const Request = new HYRequest({
  baseURL: '/api',
  timeout: TIME_OUT,
  headers: {}, // 添加必需的 headers 属性
  interceptors: {
    requestSuccessFn: (config: InternalAxiosRequestConfig) => {
      const noTokenUrls = ['/login', '/register'];
      const url = config.url ?? '';

      if (noTokenUrls.some((noTokenUrl) => url.includes(noTokenUrl))) {
        return config;
      }

      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || ({} as AxiosRequestHeaders);
        config.headers.token = token;
      }

      return config;
    }
  }
});

export default Request;
export type { HYRequestConfig, RequestInterceptors };