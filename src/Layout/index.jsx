import React, { useState, useRef, useMemo, useCallback, Suspense, lazy } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardFilled,
  DownOutlined,
  UserOutlined,
  UndoOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, Switch, Dropdown, Space, Popconfirm, Breadcrumb } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/reducers/userSlice'
import { useNavigate, Link, useLocation } from 'react-router-dom'
// 导入css（未模块化）
import './Layout.scss'
// 导入自定义组件
import TabsView from './components/TabsView'
import CustomModal from '@/components/CustomModal'
import UserCenterForm from './components/UserCenterForm'
import ResetPwdForm from './components/ResetPwdForm'
import SvgIcon from '@/components/SvgIcon'
// 导入工具类方法
import { getBreadcrumbNameMap, getItem, getTreeMenu } from '@/utils/common'

const { Header, Sider, Content } = Layout
// 提取底层路由方法
const getMenus = (routes) => {
  let menus = []
  function getMenuItem(route) {
    route.forEach((item) => {
      if (item.children && item.children.length) getMenuItem(item.children)
      else {
        // 排除默认路由
        if (item.path) menus.push(item)
      }
    })
  }
  getMenuItem(routes)
  return menus
}
const LayoutApp = () => {
  /** 通用hook */
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 侧边栏伸缩
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  // 侧边栏主题模式
  const [themeVari, setThemeVari] = useState('dark')
  // 切换侧边栏主题颜色
  const changeTheme = (value) => {
    setThemeVari(value ? 'light' : 'dark')
  }
  /** 侧边栏菜单 */
  const { pathname } = useLocation()
  const permissionRoutes = useSelector((state) => state.permission.permissionRoutes)
  // 获取当前路径数组片段
  const pathSnippets = pathname.split('/').filter((i) => i)
  const [subMenuKeys, setSubMenuKeys] = useState(pathSnippets.slice(0, -1).map((item) => '/' + item))
  const menuItems = useMemo(() => {
    return [
      getItem(
        <Link to="/home">首页</Link>,
        '/home',
        <SvgIcon name="component" width="14" height="14" color="#ccc"></SvgIcon>
      )
    ].concat(getTreeMenu(permissionRoutes))
  }, [permissionRoutes])
  // 设置菜单展开收缩
  const handleMenuOpen = (openKeys) => {
    setSubMenuKeys(openKeys)
  }
  // 点击菜单
  const handleMenuClick = ({ key }) => {
    // 菜单无子项，跳转
    if (formatRoutes.find((item) => item.menuPath === key)) navigate(key)
  }
  /** 面包屑 */
  const breadcrumbNameMap = useMemo(() => getBreadcrumbNameMap(permissionRoutes), [permissionRoutes])
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    // 如果是最后一项，即当前页面路由，渲染文本不可点击跳转
    if (index + 1 === pathSnippets.length)
      return {
        key: url,
        title: breadcrumbNameMap[url]
      }
    // 其余用link标签可点击跳转（注意：上级路由默认跳转到其定义的重定向路由，例如/system跳转至/system/user）
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>
    }
  })
  /** tabs栏 */
  // 选择选项卡以后，跳转对应路由
  const selectTab = useCallback(
    (key) => {
      navigate(key)
    },
    [navigate]
  )
  // 格式化路由数组
  const Home = lazy(() => import('@/pages/Home'))
  const formatRoutes = useMemo(() => {
    return [{ title: '首页', menuPath: '/home', element: <Home /> }].concat(getMenus(permissionRoutes))
  }, [permissionRoutes])
  // 用户头像
  const avatar = useSelector((state) => state.user.userinfo.avatar)
  /** 下拉菜单 */
  // 下拉菜单项数组
  const dropdownMenuItems = [
    {
      key: '1',
      label: (
        <div onClick={() => toggleCenterStatus(true)}>
          <UserOutlined /> 个人中心
        </div>
      )
    },
    {
      key: '2',
      label: (
        <Popconfirm
          onConfirm={() => toggleResetStatus(true)}
          title="是否确认重置密码？"
          okText="重置"
          cancelText="取消">
          <UndoOutlined /> 重置密码
        </Popconfirm>
      )
    },
    {
      key: '3',
      label: (
        <Popconfirm onConfirm={() => handleLogout()} title="是否确认退出？" okText="退出" cancelText="取消">
          <LogoutOutlined /> 退出登录
        </Popconfirm>
      )
    }
  ]
  /** 个人中心 */
  const userCenterRef = useRef()
  const toggleCenterStatus = (status) => {
    userCenterRef.current.toggleShowStatus(status)
  }
  /** 重置密码 */
  const resetPwdRef = useRef()
  const toggleResetStatus = (status) => {
    resetPwdRef.current.toggleShowStatus(status)
  }

  // 退出登录
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  // debugger
  return (
    <Layout className="layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme={themeVari}>
        <div className="layout-logo-vertical" style={{ color: themeVari === 'dark' ? '#fff' : '#000' }}>
          <span className="layout-logo">
            <DashboardFilled />
          </span>
          {!collapsed && <span>react-antd5-admin</span>}
        </div>
        <Switch
          className="sider-switch"
          checkedChildren="☀"
          unCheckedChildren="🌙"
          onChange={changeTheme}
          style={{ transform: collapsed ? 'translateX(15px)' : 'translateX(75px)' }}
        />
        <Menu
          theme={themeVari}
          mode="inline"
          selectedKeys={[pathname]}
          openKeys={subMenuKeys}
          onOpenChange={handleMenuOpen}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex'
          }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
          <div className="header-breadcrumb">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="header-right">
            <Dropdown menu={{ items: dropdownMenuItems }} placement="bottomRight">
              <Space>
                <img
                  src={avatar || require('@/assets/images/avatar/default_avatar.jpg')}
                  className="user-icon"
                  alt="avatar"
                />
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            // padding: 24,
            minHeight: 280
            // background: colorBgContainer
          }}>
          <TabsView pathname={pathname} formatRoutes={formatRoutes} selectTab={selectTab} />
        </Content>
      </Layout>
      <CustomModal title="个人中心" ref={userCenterRef}>
        <UserCenterForm toggleCenterStatus={toggleCenterStatus} />
      </CustomModal>
      <CustomModal title="重置密码" ref={resetPwdRef}>
        <ResetPwdForm toggleResetStatus={toggleResetStatus} />
      </CustomModal>
    </Layout>
  )
}
export default LayoutApp
