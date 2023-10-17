import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/userSlice'
// 创建store对象
const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
})

export default store
