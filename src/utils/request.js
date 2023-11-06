import Axios from 'axios'
import { getToken } from '../utils/auth'
import { message } from 'antd'
import { setToken, setRefreshToken } from '../utils/auth'

const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api' //请求接口url 如果不配置 则默认访问链接地址
const TIME_OUT = 20000 // 接口超时时间

const instance = Axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})

// 不需要token的接口白名单
const whiteList = ['/user/login', '/user/checkCode', '/user/refreshToken']

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.url && typeof config.url === 'string') {
      if (!whiteList.includes(config.url)) {
        let Token = getToken()
        if (Token && Token.length > 0) {
          config.headers && (config.headers['Authorization'] = Token)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export function setResponseInterceptor(store, login, logout) {
  // 是否正在刷新的标记
  let isRefreshing = false
  // 重试队列，每一项将是一个待执行的函数形式
  let requests = []
  // 添加响应拦截器
  instance.interceptors.response.use(
    (response) => {
      // 如果返回的类型为二进制文件类型
      if (response.config.responseType === 'blob') {
        if (response.status !== 200) {
          message.error('请求失败' + response.status)
          return Promise.reject()
        } else if (!response.headers['content-disposition']) {
          message.error('暂无接口访问权限')
          return Promise.reject()
        }
        return response
      } else {
        // 如果接口请求失败
        if (response.data.code !== 0) {
          let errMsg = response.data.message || '系统错误'
          // token过期
          if (response.data.code === 401) {
            const config = response.config
            // token失效,判断请求状态
            if (!isRefreshing) {
              isRefreshing = true
              // 刷新token
              return Axios({
                url: 'http://127.0.0.1:9999/user/refreshToken',
                method: 'POST',
                data: { refreshToken: store.getState().user.refreshToken }
              })
                .then((res) => {
                  // 刷新token成功，更新最新token
                  const { token, refreshToken } = res.data.data
                  store.dispatch(login({ token, refreshToken }))
                  setToken(token)
                  setRefreshToken(refreshToken)
                  //已经刷新了token，将所有队列中的请求进行重试
                  requests.forEach((cb) => {
                    cb(token)
                  })
                  // 重试完了别忘了清空这个队列
                  requests = []
                  return instance({
                    ...config,
                    headers: {
                      ...config.headers,
                      Authorization: token
                    }
                  })
                })
                .catch((e) => {
                  store.dispatch(logout())
                  // 重置token失败，跳转登录页
                  console.log(e.message)
                  window.location.href = '/login'
                })
                .finally(() => {
                  isRefreshing = false
                })
            } else {
              // 返回未执行 resolve 的 Promise
              return new Promise((resolve) => {
                // 用函数形式将 resolve 存入，等待刷新后再执行
                requests.push((token) => {
                  config.baseURL = '/api'
                  config.headers && (config.headers['Authorization'] = token)
                  resolve(
                    instance({
                      ...config,
                      headers: {
                        ...config.headers,
                        Authorization: token
                      }
                    })
                  )
                })
              })
            }
          } else {
            message.error(errMsg)
          }
          return Promise.reject(errMsg)
        }
        return response.data
      }
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

export default instance
