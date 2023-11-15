import { createSlice } from '@reduxjs/toolkit'
// 导入token、refreshToken操作方法
import { getRefreshToken, getToken, setRefreshToken, setToken, removeToken, removeRefreshToken } from '@/utils/auth'
// 导入api
import userApi from '@/api/user'
// 导入加载用户路由的方法
import { generateRoutes } from './permissionSlice'

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
      userinfo: { avatar: null }
    }
  },
  // 状态操作方法
  reducers: {
    login(state, action) {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      // 将数据持久化
      setToken(state.token)
      setRefreshToken(state.refreshToken)
    },
    setUserinfo(state, action) {
      const { payload } = action
      state.userinfo = payload
    },
    logout(state, action) {
      state.token = null
      state.refreshToken = null
      state.userinfo = { avatar: null }
      // 移除存储中的信息
      removeToken()
      removeRefreshToken()
    }
  }
})
// 导出经过redux包装的action对象
export const { login, setUserinfo, logout } = userSlice.actions
// 登录异步方法
export const loginAsync = (payload) => async (dispatch) => {
  const { data } = await userApi.login.login(payload)
  dispatch(login(data))
  const userinfo = await dispatch(getUserInfoAsync())
  dispatch(generateRoutes(userinfo.menus))
}
export const getUserInfoAsync = () => async (dispatch) => {
  const { data } = await userApi.center.get()
  dispatch(setUserinfo({ ...data, avatar: data.avatar ? process.env.React_APP_IMG_API + '/' + data.avatar : null }))
  return data
}
// 导出切片对象
export default userSlice
