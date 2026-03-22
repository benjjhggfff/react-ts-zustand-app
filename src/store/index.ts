// store.ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/userStore' // 你的切片

export const store = configureStore({
  reducer: {
    user: userReducer,
    // ...其他reducer
  },
})

// 从store中导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 导出类型化的hooks
import { useDispatch, useSelector } from 'react-redux'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector<RootState, TSelected>(selector)

export default store
