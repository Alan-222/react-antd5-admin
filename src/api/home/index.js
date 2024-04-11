import request from '@/utils/request'
const apiMap = {
    // 角色资源获取
    resource: {
        entity: getEntityCount,
        module: getModuleMenuCount
    }
}
export default apiMap

// 获取各实体数量
function getEntityCount(params) {
    return request({
        url: `/dashboard/getCount`,
        method: 'get',
        params
    })
}

// 获取各实体数量
function getModuleMenuCount(params) {
    return request({
        url: `/dashboard/getModuleCount`,
        method: 'get',
        params
    })
}
