import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.scss'
// 全局导入svg图标
import '@/assets/Icon'
// 导入redux相关库及文件
import store from './store'
import { Provider } from 'react-redux'
import { login, logout } from './store/reducers/userSlice'
// 导入缓存外层组件
import { AliveScope } from 'react-activation'
// 导入axios的响应拦截器方法
import { setResponseInterceptor } from './utils/request'
// 设置axios的响应拦截器
setResponseInterceptor(store, login, logout)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AliveScope>
        <App />
      </AliveScope>
    </BrowserRouter>
  </Provider>
)
