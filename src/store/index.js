import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/userSlice'
import permissionSlice from './reducers/permissionSlice'
import tabSlice from './reducers/tabSlice'
// 创建store对象
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    permission: permissionSlice.reducer,
    tabs: tabSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      //关闭redux序列化检测
      serializableCheck: false
    })
})

export default store
