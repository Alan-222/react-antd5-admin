import { Button } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

const AuthComponent = ({ permission, children, type = 'primary', ...props }) => {
  // 获取权限标识数组
  const rolePermission = useSelector((state) => state.user.userinfo?.buttons)
  // 遍历数组判断是否存在此权限标识
  if (rolePermission.includes(permission)) {
    return (
      <Button type={type} {...props}>
        {children}
      </Button>
    )
  }
  return null
}
export default AuthComponent
