import { Navigate } from 'react-router-dom'
import Layout from '@/Layout'
import Home from '@/pages/Home'
import User from '@/pages/System/User'
import Role from '@/pages/System/Role'
import Auth from '@/pages/System/Auth'
import System from '@/pages/System'

const routes = [
  // 访问/时重定向到/home
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      {
        path: 'system',
        element: <System />,
        children: [
          { index: true, element: <Navigate to="/system/user" replace /> },
          { path: 'user', element: <User /> },
          { path: 'role', element: <Role /> },
          { path: 'auth', element: <Auth /> }
        ]
      }
    ]
  }
]
export default routes
