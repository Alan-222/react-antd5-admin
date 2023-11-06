import React, { Suspense, useEffect } from 'react'
// 导入路由及react-redux钩子
import { useNavigate, useRoutes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// 导入api
import { getUserInfoAsync } from './store/reducers/userSlice'
import { generateRoutes } from './store/reducers/permissionSlice'
import { getToken } from './utils/auth'
// 导入loading组件
import Loading from '@/components/Loading'

export default function App() {
  // redux hook
  const dispatch = useDispatch()
  const routes = useSelector((state) => state.permission.routes)
  // 跳转方法
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (getToken()) {
        const userInfo = await dispatch(getUserInfoAsync())
        dispatch(generateRoutes(userInfo.menus))
      } else {
        navigate('/login', { replace: true })
      }
    }
    fetchData()
  }, [dispatch])
  // 利用hook转换路由表
  const element = useRoutes(routes)
  return (
    <>
      <Suspense fallback={<Loading />}>{routes && element}</Suspense>
    </>
  )
}
