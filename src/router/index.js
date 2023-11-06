import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
// 用路由懒加载优化加载性能
const Layout = lazy(() => import('@/Layout'))
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const constantRoutes = [
  { path: 'login', title: '登录', element: <Login /> },
  {
    path: '/',
    title: '首页',
    hidden: true,
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={'/home'} replace /> },
      // hidden:false代表要显示在侧边导航栏，其余皆不显示
      { path: 'home', title: '首页', element: <Home />, hidden: false }
    ]
  },
  { path: '*', title: '404页面', element: <NotFound /> }
]
export default constantRoutes
