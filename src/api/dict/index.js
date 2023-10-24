import request from '@/utils/request'
const apiMap = {
  // 字典管理
  manage: {
    add: addDict,
    update: updateDict,
    del: deleteDicts,
    query: listDicts,
    queryById: getDictDetail,
    queryByName: getDictByName
  },
  // 字典项
  itemManage: {
    add: addDictItem,
    update: updateDictItem,
    del: deleteDictItems,
    queryById: getDictItemDetail
  }
}

export default apiMap

// 获取字典列表
function listDicts(params) {
  return request({
    url: '/dict/listDict',
    method: 'get',
    params: params
  })
}

function addDict(form) {
  return request({
    url: '/dict/addDict',
    method: 'post',
    data: form
  })
}

function updateDict(dict_id, form) {
  return request({
    url: '/dict/editDict?id=' + dict_id,
    method: 'post',
    data: form
  })
}

function deleteDicts(dict_id) {
  return request({
    url: '/dict/delDict',
    method: 'post',
    data: dict_id
  })
}

// 根据id获取字典数据
function getDictDetail(dict_id) {
  return request({
    url: '/dict/getDict',
    method: 'get',
    params: {
      id: dict_id
    }
  })
}

// 根据字典名称获取字典数据
function getDictByName(dict_code) {
  return request({
    url: '/dict/getDictByName',
    method: 'get',
    params: {
      dict_code: dict_code
    }
  })
}

// 对字典项进行增删改
function addDictItem(form) {
  return request({
    url: '/dict/item/addDictItem',
    method: 'post',
    data: form
  })
}

function updateDictItem(dictItem_id, form) {
  return request({
    url: '/dict/item/editDictItem?id=' + dictItem_id,
    method: 'post',
    data: form
  })
}

function deleteDictItems(dictItem_id) {
  return request({
    url: '/dict/item/delDictItem',
    method: 'post',
    data: dictItem_id
  })
}

// 根据id获取字典数据
function getDictItemDetail(dictItem_id) {
  return request({
    url: '/dict/item/getDictItem',
    method: 'get',
    params: {
      id: dictItem_id
    }
  })
}
