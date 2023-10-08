import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const System = () => {
  return (
    <div>
      <div>
        System的头部导航：
        <Link to="/system/user" style={{ marginRight: 20 }}>
          用户管理
        </Link>
        <Link to="/system/role" style={{ marginRight: 20 }}>
          角色管理
        </Link>
        <Link to="/system/auth">权限管理</Link>
      </div>
      System的内容区域：
      <Outlet />
    </div>
  )
}

export default System
