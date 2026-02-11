import Request from '../service/request' // 导入封装的请求实例
import type { LoginParams, LoginResponse, ApiResponse, UserInfo } from '../constants/index'

// 登录接口
export const loginApi = (params: LoginParams): Promise<LoginResponse> => {
  return Request.post({ url: '/login', data: params })
}

// 获取用户信息接口
export const fetchUserInfoApi = (): Promise<ApiResponse<UserInfo>> => {
  return Request.get({ url: '/userInfo' })
}
