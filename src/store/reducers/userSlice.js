import { createSlice } from '@reduxjs/toolkit'
import { getToken, getRefreshToken } from '@/utils/auth'
/**
 * 创建一个用户状态切片
 */
const userSlice = createSlice({
  // 用来作为区分的模块名称
  name: 'user',
  // 状态初始值
  initialState: () => {
    // 如果localStorage中有从其中取，否则为null
    const token = getToken() || null
    const refreshToken = getRefreshToken() || null
    return {
      token,
      refreshToken,
      userinfo: { username: 'Alan' }
    }
  },
  // 状态操作方法
  reducers: {
    setUserinfo(state, action) {
      const { payload } = action
      state.userinfo = payload
    }
  }
})
// 导出经过redux包装的action对象
export const { setUserinfo } = userSlice.actions
// 导出切片对象
export default userSlice
