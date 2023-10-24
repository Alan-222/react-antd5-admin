import Axios from 'axios'
import { getToken } from '../utils/auth'
import { message } from 'antd'

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
        return Promise.reject(errMsg)
      }
      return response.data
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
