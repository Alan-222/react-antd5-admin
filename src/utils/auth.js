// 设置token键值
const TokenKey = 'ACCESS-TOKEN'
/**
 * 获取token
 */
const getToken = () => {
  return window.localStorage.getItem(TokenKey)
}
/**
 * 设置token
 * @param token
 */
const setToken = (token) => {
  return window.localStorage.setItem(TokenKey, token)
}
/**
 * 移除token
 */
const removeToken = () => {
  return window.localStorage.removeItem(TokenKey)
}
// refreshToken键值
const RefreshTokenKey = 'REFRESH-TOKEN'

const getRefreshToken = () => {
  return window.localStorage.getItem(RefreshTokenKey)
}

const setRefreshToken = (token) => {
  return window.localStorage.setItem(RefreshTokenKey, token, { expires: 2 })
}

const removeRefreshToken = () => {
  return window.localStorage.removeItem(RefreshTokenKey)
}
export { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken }
