import { configureStore } from '@reduxjs/toolkit'
import loginReduers from './modules/userStore'
export type AppDispatch = typeof store.dispatch

const store = configureStore({
  reducer: {
    user: loginReduers,
  },
})
export default store
