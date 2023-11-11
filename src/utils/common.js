/**
 * 内置一些工具类函数
 */

// 导入图标组件
import SvgIcon from '@/components/SvgIcon'
/**
 * 获取面包屑平铺对象 , 例:{"/home":"首页"}
 * @param {*} routes
 * @returns
 */
export const getBreadcrumbNameMap = (routes) => {
  //首先进行深拷贝
  let list = JSON.parse(JSON.stringify(routes))
  list = [{ path: 'home', redirect: '/home', title: '首页' }, ...list]
  let newObj = {}
  const getItems = (list) => {
    //先遍历数组
    list.forEach((item) => {
      //遍历数组项的对象
      if (item.children && item.children.length) {
        newObj[item.redirect] = item.title
        getItems(item.children)
      } else {
        newObj[item.redirect] = item.title
      }
    })
  }
  //调用一下递归函数
  getItems(list)
  //返回新数组
  return newObj
}

/** 获取菜单项 */
export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}
/**
 * 获取侧边栏菜单项
 * @param {*} menuData 嵌套的路由数组
 * @returns
 */
export const getTreeMenu = (menuData) => {
  if (!menuData || !menuData.length) return
  const menuItems = []
  menuData.forEach((item) => {
    if (!item.hidden) {
      // 如果有子菜单
      if (item.children && item.children.length > 0) {
        menuItems.push(
          getItem(
            item.title,
            '/' + item.path,
            <SvgIcon name={item.icon ?? 'component'} width="14" height="14" color="#ccc" />,
            getTreeMenu(item.children)
          )
        )
      } else {
        if (item.path) {
          menuItems.push(
            getItem(
              item.title,
              item.menuPath,
              <SvgIcon name={item.icon ?? 'component'} width="14" height="14" color="#ccc" />
            )
          )
        }
      }
    }
  })
  return menuItems
}
