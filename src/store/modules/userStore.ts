import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginApi, fetchUserInfoApi } from '../../api/user' // 你的接口文件
import type {
  LoginParams,
  LoginResponse,
  UserInfoResponse,
  UserInfo,
  ApiResponse,
} from '../../constants/index' // 你的类型文件
import type { MenuItem } from '../../constants/routerPermiss' // 你的菜单类型文件
// 1. 登录异步Thunk（无类型错误版本）
export const loginAsync = createAsyncThunk<
  LoginResponse, // 成功返回类型：LoginResponse = ApiResponse<LoginData>
  LoginParams, // 入参类型：LoginParams
  { rejectValue: string } // 失败抛出类型：string
>('user/login', async (params: LoginParams, { rejectWithValue }) => {
  try {
    // 强制指定返回类型为 LoginResponse，确保类型匹配
    const response: LoginResponse = await loginApi(params)
    console.log(response)
    // 业务校验：code≠200 视为失败，抛出错误
    if (response.code !== 200) {
      return rejectWithValue(response.msg || '登录失败')
    }
    // 本地存储token
    localStorage.setItem('token', response.data?.token || '')

    // 成功分支：仅返回 LoginResponse 类型
    return response
  } catch (err: any) {
    // 异常分支：仅抛出字符串错误，绝不返回裸字符串
    const errorMsg = err?.msg || err?.message || '登录请求失败'
    return rejectWithValue(errorMsg)
  }
})

// 2. 获取用户信息异步Thunk（配套实现）
export const fetchUserInfo = createAsyncThunk<
  ApiResponse<UserInfoResponse>, // 成功返回：ApiResponse<UserInfo>
  void, // 无入参
  { rejectValue: string }
>('user/fetchUserInfo', async (_, { rejectWithValue }) => {
  try {
    const response: ApiResponse<UserInfo> = await fetchUserInfoApi()
    if (response.code !== 200) {
      return rejectWithValue(response.msg || '获取用户信息失败')
    }
    return response
  } catch (err: any) {
    return rejectWithValue(err?.message || '获取用户信息请求失败')
  }
})

// 3. 用户Slice初始状态
interface UserState {
  userInfo: UserInfo | null
  token: string
  loading: boolean
  error: string | null
  menuList: MenuItem[] // 存储用户的菜单列表
  privileges: string[] // 存储用户的权限标识列表
}

const initialState: UserState = {
  userInfo: null,
  token: localStorage.getItem('token') || '',
  loading: false,
  error: null,
  menuList: JSON.parse(localStorage.getItem('menuList') || '[]'),
  privileges: JSON.parse(localStorage.getItem('privileges') || '[]'),
}

// 4. 用户Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: state => {
      state.userInfo = null
      state.token = ''
      state.menuList = []
      state.privileges = []
      localStorage.removeItem('token')
      localStorage.removeItem('menuList')
      localStorage.removeItem('privileges')
    },
  },
  extraReducers: builder => {
    builder
      // 登录请求状态
      .addCase(loginAsync.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.data?.token || ''
        localStorage.setItem('token', state.token)
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || '登录失败'
      })
      // 获取用户信息状态
      .addCase(fetchUserInfo.pending, state => {
        state.loading = true
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload.data?.user || null
        // 存储菜单和权限到 state + localStorage（刷新不丢失）
        state.menuList = action.payload.data?.permission.menu || []
        state.privileges = action.payload.data?.permission.privileges || []
        localStorage.setItem('menuList', JSON.stringify(state.menuList))
        localStorage.setItem('privileges', JSON.stringify(state.privileges))
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = '获取用户信息失败'
      })
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer
