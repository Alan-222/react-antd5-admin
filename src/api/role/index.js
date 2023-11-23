import request from '@/utils/request'
const apiMap = {
  // 角色管理
  manage: {
    add: addRole,
    update: updateRole,
    del: deleteRoles,
    query: listRolePages,
    queryById: getRoleFormDetail,
    queryAll: allRole // 获取所有
  },
  // 角色资源获取
  resource: {
    getRes: getRoleResources,
    updRes: updateRoleResource
  }
}
export default apiMap

// 获取角色列表
function listRolePages(params) {
  return request({
    url: '/user/role/listRole',
    method: 'get',
    params: params
  })
}
// 获取所有角色
function allRole() {
  return request({
    url: '/user/role/allRole',
    method: 'get'
  })
}
// 获取角色资源
function getRoleResources(role_id) {
  return request({
    url: '/user/role/roleAuth',
    params: {
      role_id: role_id
    }
  })
}
// 更新角色资源
function updateRoleResource(role_id, roleResource) {
  return request({
    url: '/user/role/updateRoleResource?role_id=' + role_id,
    method: 'post',
    data: roleResource
  })
}

function addRole(form) {
  return request({
    url: '/user/role/addRole',
    method: 'post',
    data: form
  })
}

function updateRole(role_id, form) {
  return request({
    url: '/user/role/editRole?role_id=' + role_id,
    method: 'post',
    data: form
  })
}

function deleteRoles(ids) {
  return request({
    url: '/user/role/delRole',
    method: 'post',
    data: ids
  })
}

// 根据id获取角色数据
function getRoleFormDetail(role_id) {
  return request({
    url: `/user/role/getRole`,
    method: 'get',
    params: {
      role_id: role_id
    }
  })
}
