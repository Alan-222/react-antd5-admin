import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
export default function NotFound() {
  const navigate = useNavigate()
  const backHome = () => {
    navigate('/', { replace: true })
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，你访问的页面不存在"
      extra={
        <Button type="primary" onClick={backHome}>
          回到首页
        </Button>
      }
    />
  )
}
