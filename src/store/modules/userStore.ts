import {createSlice,type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { type UserState,type RootState} from '../type';
import {type UserInfo,type MenuItem,type ApiResponse} from '../../constants/index'

const initialState:UserState={
    baseInfo:{
    userId:'',
    userName:'',
    avatar:'',
    role:'',
    department:'',
    },
    token:'',
    loading: false,
    error: null,
}
// 异步
export const fetchUserInfo = createAsyncThunk<
  ApiResponse<{ user: UserInfo; privileges: string[]; menu: MenuItem[] }>,
  void,
  { rejectValue: ApiResponse }
>('user/fetchUserInfo', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState;
    const token = state.user.token;
    const res = await axios.get<ApiResponse>('/api/user/info', {
      headers: { token },
    });
    return res.data;
  } catch (err) {
    const error = err as any;
    return rejectWithValue(error.response?.data || { code: 500, msg: '请求失败' });
  }
});


 const userLoginSlice = createSlice({
    name:'userLogin',
    initialState,
    // 编写修改数据的方法，同步方法
    reducers:{
        setToken(state:UserInfoState,action:PayloadAction<any>){
            let data:UserInfoState= action.payload
            state.token = data.token
            state.baseInfo = data.baseInfo
        },
        logout(state:UserInfoState){
            state.token = ''
            state.baseInfo = {
                userId:'',
                userName:'',
                avatar:'',
                role:'',
                department:'',
            }
        },
       extraReducers:()=>{
           builder
           .addCase
       }
    }
})


const {setToken} = userLoginSlice.actions
const reducers=userLoginSlice.reducer
export default reducers
export {setToken}