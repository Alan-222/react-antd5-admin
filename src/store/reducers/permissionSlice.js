import { createSlice } from '@reduxjs/toolkit'
import { lazy } from 'react'
import constantRoutes from '@/router'
import { Navigate } from 'react-router-dom'
// const Layout = lazy(() => import('../../pages/Layout/Layout'))

// 得到后端路由经转换后的路由结构
function filterAsyncRoutes(routes) {
  const res = []
  // 遍历得到的路由转换为前端router结构
  routes.forEach((route) => {
    // 页面路由懒加载
    const Component = lazy(() => import(`@/pages${route.component}`))
    const tmp = {
      path: route.path,
      // 若为Layout则直接用父路由的Layout结构，否则用src/pages目录去拼接
      element: route.component === 'Layout' ? null : <Component />,
      redirect: route.redirect || undefined,
      title: route.title,
      // 将Number类型hidden转为Boolean
      hidden: !!Number(route.hidden),
      children: route.children || undefined
    }
    if (route.icon) {
      tmp.icon = route.icon
    }
    if (tmp.children && tmp.children.length) {
      tmp.children = route.redirect
        ? [{ index: true, element: <Navigate to={route.redirect} replace /> }].concat(filterAsyncRoutes(tmp.children))
        : filterAsyncRoutes(tmp.children)
      // tmp.children = filterAsyncRoutes(tmp.children)
    }
    res.push(tmp)
  })
  return res
}
const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    // routers默认为静态路由，之后拼接上服务器返回动态路由
    routes: constantRoutes,
    permissionRoutes: []
  },
  reducers: {
    setRoutes(state, action) {
      state.routes = constantRoutes.map((item) => {
        if (item.path === '/') {
          return { ...item, children: item.children.concat(action.payload.routes) }
        }
        return item
      })
    },
    setPermissionRoutes(state, action) {
      state.permissionRoutes = action.payload.routes
    }
  }
})

export const { setRoutes, setPermissionRoutes } = permissionSlice.actions
export const generateRoutes = (payload) => (dispatch) => {
  const accessedRoutes = filterAsyncRoutes(payload)
  // 分发全局路由状态（静态 + 动态）
  dispatch(setRoutes({ routes: accessedRoutes }))
  // 分发动态路由
  dispatch(setPermissionRoutes({ routes: accessedRoutes }))
  return accessedRoutes
}

export default permissionSlice
