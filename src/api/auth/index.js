import request from '@/utils/request'

const apiMap = {
  // 权限管理
  manage: {
    add: addAuth,
    update: updateAuth,
    del: deleteAuths,
    query: listAuths,
    queryById: getAuthDetail
  },
  // 权限选项
  options: {
    getMenus: listMenuOptions,
    getBtns: listBtnOptions
  }
}
export default apiMap

// 获取角色列表
function listAuths(params) {
  return request({
    url: '/user/menu/listMenu',
    method: 'get',
    params: params
  })
}
// 获取菜单子集列表
function listMenuOptions() {
  return request({
    url: '/user/menu/listMenuOptions',
    method: 'get'
  })
}
// 获取权限列表（包含菜单及按钮）
function listBtnOptions() {
  return request({
    url: '/user/menu/listAuthOptions',
    method: 'get'
  })
}
// 添加权限
function addAuth(form) {
  return request({
    url: '/user/menu/addMenu',
    method: 'post',
    data: form
  })
}
// 修改权限
function updateAuth(menu_id, form) {
  return request({
    url: '/user/menu/editMenu?menu_id=' + menu_id,
    method: 'post',
    data: form
  })
}

function deleteAuths(menu_id) {
  return request({
    url: '/user/menu/delMenu',
    method: 'post',
    data: menu_id
  })
}

// 根据id获取角色数据
function getAuthDetail(menu_id) {
  return request({
    url: '/user/menu/getMenu',
    method: 'get',
    params: {
      menu_id: menu_id
    }
  })
}
