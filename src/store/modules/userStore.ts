import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { type UserState } from '../type'
import { type ApiResponse, type LoginParams } from '../../constants/index'
import { loginApi, fetchUserInfoApi } from '../../api/user'
const initialState: UserState = {
  baseInfo: {
    userId: '',
    userName: '',
    avatar: '',
    role: 7,
    department: '',
  },
  token: '',
  loading: false,
  error: null,
}
// 异步
/**
 * 登录异步Action,返回值类型为string（token）或ApiResponse（错误信息），参数类型为LoginParams，rejectValue类型为string（错误消息）
 */
export const loginAsync = createAsyncThunk<
  string | ApiResponse<string>,
  LoginParams,
  { rejectValue: string }
>('user/login', async (params, { rejectWithValue }) => {
  try {
    return await loginApi(params) // 调用封装API，无需处理Axios
  } catch (err) {
    const error = err as Error
    return rejectWithValue(error.message || '网络错误')
  }
})

/**
 * 获取用户信息异步Action
 */
export const fetchUserInfo = createAsyncThunk<
  ApiResponse<{ user: any | ApiResponse<string>; privileges: string[]; menu: any[] }>,
  void,
  { rejectValue: ApiResponse }
>('user/fetchUserInfo', async (_, { rejectWithValue }) => {
  try {
    return await fetchUserInfoApi() // 调用封装API，无需传Token
  } catch (err) {
    const error = err as any
    return rejectWithValue(error.response?.data || { code: 500, msg: '请求失败' })
  }
})

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState,
  // 编写修改数据的方法，同步方法
  reducers: {
    setToken(state: UserState, action: PayloadAction<any>) {
      let data: UserState = action.payload
      state.token = data.token
      state.baseInfo = data.baseInfo
    },
    logout(state: UserState) {
      state.token = ''
      state.baseInfo = {
        userId: '',
        userName: '',
        avatar: '',
        role: 7,
        department: '',
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAsync.fulfilled, (state: UserState, action: PayloadAction<string>) => {
        state.loading = false
        state.token = action.payload
      })
      .addCase(loginAsync.pending, (state: UserState) => {
        state.loading = true
      })
      .addCase(
        loginAsync.rejected,
        (state: UserState, action: PayloadAction<string | undefined>) => {
          state.loading = false
          state.error = action.payload || '登录失败'
        }
      )

      .addCase(fetchUserInfo.fulfilled, (state: UserState, action: PayloadAction<any>) => {
        const { user } = action.payload.data || {}
        if (user) {
          state.baseInfo = user
        }
      })
  },
})

const { setToken } = userLoginSlice.actions
const reducers = userLoginSlice.reducer
export default reducers
export { setToken }
