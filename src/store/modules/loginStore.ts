import { configureStore,createSlice,PayloadAction } from "@reduxjs/toolkit";
interface UserState {
    token: string;
    userInfo:{}
}
 const userLoginSlice = createSlice({
    name:'userLogin',
    initialState:{
        token:'',
        userInfo:{},
    } as UserState,
    // 编写修改数据的方法，同步方法
    reducers:{
        setToken(state:UserState,action:PayloadAction<string>){
            state.token = action.payload
        },
    }
})


const {setToken} = userLoginSlice.actions
const reducers=userLoginSlice.reducer
export default reducers
export {setToken}