import React, { useEffect, useMemo, useState } from 'react'
import { Tabs, ConfigProvider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { addTab, removeTab } from '@/store/reducers/tabSlice'

const TabsView = React.memo(({ pathname, formatRoutes, selectTab }) => {
  // 获取全局tabs
  const tabs = useSelector((state) => state.tabs.tabs)
  const dispatch = useDispatch()
  // 当前选中tab
  const [activeKey, setActiveKey] = useState()
  // Tabs 点击添加配置
  useEffect(() => {
    if (pathname !== '/') {
      setActiveKey(pathname)
      // 数组中无此项，进行添加
      if (!tabs.some((item) => item.key === pathname)) {
        onAddTab(pathname)
      }
    }
  }, [pathname])
  // Tabs渲染所用数组，当长度为1时Tab项不显示关闭
  const tabItems = useMemo(() => {
    return tabs.map((item) => ({
      ...item,
      closable: tabs.length > 1
    }))
  }, [tabs])
  /** tab操作方法 */
  // tab切换事件
  const handleTabChange = (activeKey) => {
    selectTab(activeKey)
  }
  // 添加方法
  const onAddTab = (pathname) => {
    // 找到对应路径的菜单信息
    const menu = formatRoutes.find((item) => item.menuPath === pathname)
    if (menu)
      dispatch(
        addTab({
          label: menu.title,
          key: menu.menuPath,
          children: <div style={{ padding: 24, backgroundColor: '#f5f5f5' }}>{menu.element}</div>
        })
      )
  }
  // 点击选项卡关闭
  const closeTab = (targetKey) => {
    // 获取删除后的数组
    const afterRemoveTabs = tabs.filter((item) => item.key !== targetKey)
    // 获取选中跳转的数组下标
    const selectIndex = tabs.findIndex((item) => item.key === targetKey) - 1
    if (selectIndex >= 0) {
      selectTab(afterRemoveTabs[selectIndex].key)
    } else {
      selectTab(afterRemoveTabs[selectIndex + 1].key)
    }
    dispatch(removeTab(targetKey))
  }

  const handleEdit = (targetKey, action) => {
    if (action === 'remove') {
      closeTab(targetKey)
    }
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            /* here is your component tokens */
            // 横向标签页标签外间距
            horizontalMargin: 0
          }
        }
      }}>
      <div style={{ backgroundColor: '#fff' }}>
        <Tabs
          type="editable-card"
          onChange={handleTabChange}
          activeKey={activeKey}
          onEdit={handleEdit}
          items={tabItems}
          hideAdd
        />
      </div>
    </ConfigProvider>
  )
})
export default TabsView
