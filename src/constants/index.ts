import type { MenuItem } from './routerPermiss'
export interface UserInfo {
  baseInfo: {
    userId: string
    userName: string
    avatar: string
    role: number
    // 部门/学院
    department: string
  }
  token: string
}

export interface ApiResponse<T = any> {
  code: number
  data?: T
  msg: string
}
export interface LoginData {
  token: string
}

// 登录接口的完整响应类型（复用通用 ApiResponse）
export type LoginResponse = ApiResponse<LoginData>
// 菜单项类型

export interface UserInfoResponse {
  user: UserInfo
  permission: {
    privileges: string[]
    menu: MenuItem[]
  }
}

export interface LoginParams {
  userId: string
  password: string
}
