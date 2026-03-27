import type { MenuItem } from './routerPermiss'

// Supabase 登录响应类型
export interface SupabaseLoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: UserInfo
  weak_password: null | string
}

// Supabase 用户信息类型
export interface UserInfo {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  // 头像
  avatar: string
  phone: string
  confirmed_at: string
  last_sign_in_at: string
  app_metadata: {
    provider: string
    providers: string[]
  }
  user_metadata: {
    email_verified: boolean
  }
  identities: Array<{
    identity_id: string
    id: string
    user_id: string
    identity_data: {
      email: string
      email_verified: boolean
      phone_verified: boolean
      sub: string
    }
    provider: string
    last_sign_in_at: string
    created_at: string
    updated_at: string
    email: string
  }>
  created_at: string
  updated_at: string
  is_anonymous: boolean
  // 额外信息
  name?: string
  verified?: boolean
  real_name?: string
  id_card?: string
}

export interface ApiResponse<T = any> {
  code: number
  data?: T
  msg: string
}

// 登录接口的完整响应类型
export type LoginResponse = SupabaseLoginResponse

// 用户信息响应类型（用于获取用户信息接口）
export interface UserInfoResponse {
  user: UserInfo
  permission: {
    privileges: string[]
    menu: MenuItem[]
  }
}

export interface LoginParams {
  email: string
  password: string
}

export interface UploadFileInput {
  path: string
  size: number
  name: string
  orginalFileObj: File
}
