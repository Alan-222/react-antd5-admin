import React, { useRef, useState } from 'react'
import { Space, Card, Popconfirm, Tag, message } from 'antd'
// 导入api
import roleApi from '@/api/role'
// 导入自定义字典hook
import useDict from '@/hooks/useDict'
// 导入组件
import SearchBar from '@/components/SearchBar'
import CustomModal from '@/components/CustomModal'
import CustomTable from '@/components/CustomTable'
import RoleEditForm from './components/RoleEditForm'
import RoleAuthTree from './components/RoleAuthTree'
import AuthComponent from '@/components/AuthComponent'

const Role = () => {
  // 所需字典
  const statusDict = useDict('status')
  /** 搜索栏参数 */
  //搜索栏表单项数组
  const formItemList = [
    { formItemProps: { name: 'role_name', label: '角色名' }, valueCompProps: {} },
    {
      formItemProps: { name: 'status', label: '状态' },
      valueCompProps: { type: 'select', selectvalues: statusDict }
    }
  ]
  /** 表格参数及表格配置 */
  const [requestParam, setRequestParam] = useState({
    pageSize: 5,
    current: 1
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState()
  const columns = [
    {
      title: '角色编号',
      dataIndex: 'role_id',
      key: 'role_id',
      align: 'center'
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      align: 'center'
    },
    {
      title: '角色描述',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === '1' ? 'green' : 'red'
        const statusItem = statusDict.find((item) => item.value === status)
        return statusItem ? <Tag color={color}>{statusItem.label}</Tag> : ''
      },
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row) => (
        <Space
          style={{
            cursor: 'pointer',
            color: '#2378f7',
            fontSize: '15px'
          }}>
          <span onClick={() => editRow(row.role_id)}>
            <AuthComponent permission="system:role:edit" type="link" title="编辑">
              编辑
            </AuthComponent>
          </span>
          <Popconfirm title="删除角色" description="确定要删除吗？" onConfirm={() => deleteRow(row.role_id)}>
            <AuthComponent permission="system:role:del" type="link" title="删除" danger>
              删除
            </AuthComponent>
          </Popconfirm>
          <span onClick={() => assignRoleAuth(row.role_id)}>
            <AuthComponent permission="system:role:assignAuth" type="link" title="分配权限">
              分配权限
            </AuthComponent>
          </span>
        </Space>
      ),
      align: 'center'
    }
  ]
  /** 表格操作方法 */
  // 改变参数
  const onParamChange = (searchParams) => {
    if (!Object.keys(searchParams).length)
      setRequestParam({
        ...requestParam,
        role_name: undefined,
        status: undefined
      })
    else setRequestParam({ ...requestParam, ...searchParams })
  }
  // 选择角色
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }
  const addRow = () => {
    setRoleId('')
    toggleModalStatus(true)
  }
  const editRow = async (role_id) => {
    setRoleId(role_id)
    toggleModalStatus(true)
  }
  const deleteRow = async (role_ids) => {
    try {
      await roleApi.manage.del({ role_ids })
      message.success('删除成功')
      // 重新请求表格
      onParamChange({})
    }catch (e) {
      message.error(e)
    }
  }
  const assignRoleAuth = async (role_id) => {
    // 获取该角色id的权限数据
    const { data } = await roleApi.resource.getRes(role_id)
    setAssignRoleId(role_id)
    setRoleAuths(data)
    toggleAssignStatus(true)
  }
  /** 角色编辑弹窗 */
  // 当前编辑角色id
  const [role_id, setRoleId] = useState()
  const roleModalRef = useRef()
  const toggleModalStatus = (status) => {
    roleModalRef.current.toggleShowStatus(status)
  }
  /** 分配角色权限 */
  const [assignRoleId, setAssignRoleId] = useState()
  // 当前行角色权限数据
  const roleAuthRef = useRef()
  const [roleAuths, setRoleAuths] = useState([])
  const toggleAssignStatus = (status) => {
    roleAuthRef.current.toggleShowStatus(status)
  }

  return (
    <>
      <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
      <Card>
        <Space>
          <AuthComponent permission="system:role:add" onClick={addRow}>
            新增
          </AuthComponent>
          {selectedRowKeys && selectedRowKeys.length > 0 && (
            <Popconfirm title="删除角色" description="确定要删除吗？" onConfirm={() => deleteRow(selectedRowKeys)}>
              <AuthComponent permission="system:role:del" danger>
                批量删除
              </AuthComponent>
            </Popconfirm>
          )}
        </Space>
      </Card>
      <CustomTable
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={columns}
        rowKey="role_id"
        bordered
        fetchMethod={roleApi.manage.query}
        requestParam={requestParam}
        onParamsChange={onParamChange}
      />
      <CustomModal title="角色编辑" ref={roleModalRef}>
        <RoleEditForm
          role_id={role_id}
          dict={{ statusDict }}
          toggleModalStatus={toggleModalStatus}
          onRefreshTable={onParamChange}></RoleEditForm>
      </CustomModal>
      <CustomModal title="分配角色权限" ref={roleAuthRef}>
        <RoleAuthTree
          role_id={assignRoleId}
          roleAuths={roleAuths}
          toggleAssignStatus={toggleAssignStatus}></RoleAuthTree>
      </CustomModal>
    </>
  )
}
export default Role
