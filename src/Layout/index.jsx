import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        Layout的头部导航：
        <Link to="/home" style={{ marginRight: 20 }}>
          首页
        </Link>
        <Link to="/system">系统管理</Link>
      </div>
      Layout的内容区域
      <Outlet />
    </div>
  )
}

export default Layout
