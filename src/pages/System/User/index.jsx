import React, { useRef, useState } from 'react'
import { Card, Space, Tag, Popconfirm, message } from 'antd'
// 导入组件
import SearchBar from '@/components/SearchBar'
import AuthComponent from '@/components/AuthComponent'
import CustomTable from '@/components/CustomTable'
import CustomModal from '@/components/CustomModal'
import UserEditForm from './components/UserEditForm'
// 导入获取字典hook
import useDict from '@/hooks/useDict'
// 导入api
import userApi from '@/api/user'

const User = () => {
  // 状态字典
  const statusDict = useDict('status')
  /** 搜索栏参数 */
  // 搜索栏表单项数组
  const formItemList = [
    { formItemProps: { name: 'username', label: '用户名' }, valueCompProps: {} },
    { formItemProps: { name: 'nickname', label: '昵称' }, valueCompProps: {} },
    { formItemProps: { name: 'email', label: '邮箱' }, valueCompProps: {} },
    {
      formItemProps: { name: 'status', label: '状态' },
      valueCompProps: { type: 'select', selectvalues: statusDict }
    }
  ]
  /** 表格参数 */
  // 勾选的用户
  const [selectedRowKeys, setSelectedRowKeys] = useState()
  // 表格配置项
  const columns = [
    {
      title: '用户编号',
      dataIndex: 'user_id',
      align: 'center'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center'
    },
    {
      title: '角色',
      dataIndex: 'roles',
      render: (roles) => (
        <span>
          {roles.map((item) => {
            let color = ''
            if (item.role_name === '管理员') color = 'geekblue'
            else color = 'green'
            return (
              <Tag color={color} key={item.role_id}>
                {item.role_name}
              </Tag>
            )
          })}
        </span>
      ),
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
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
          <AuthComponent permission="system:user:edit" title="编辑" type="link" onClick={() => editRow(row.user_id)}>
            编辑
          </AuthComponent>
          <Popconfirm title="删除用户" description="确定要删除吗？" onConfirm={() => deleteRow(row.user_id)}>
            <AuthComponent permission="system:user:del" title="删除" type="link" danger>
              删除
            </AuthComponent>
          </Popconfirm>
          <Popconfirm title="重置密码" description="确定要重置吗" onConfirm={() => resetPwd(row.user_id)}>
            <AuthComponent permission="system:user:resetPwd" type="link" title="重置密码">
              重置密码
            </AuthComponent>
          </Popconfirm>
        </Space>
      ),
      align: 'center'
    }
  ]
  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 5,
    current: 1
  })
  // 选择用户
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }
  /** 表格事件 */
  // 改变参数
  const onParamChange = (searchParams) => {
    if (!Object.keys(searchParams).length)
      setRequestParam({
        ...requestParam,
        username: undefined,
        nickname: undefined,
        email: undefined,
        status: undefined
      })
    else setRequestParam({ ...requestParam, ...searchParams })
  }
  // 新增
  const addRow = () => {
    setEditType('add')
    setUserId('')
    toggleModalStatus(true)
  }
  // 编辑
  const editRow = (user_id) => {
    setEditType('edit')
    setUserId(user_id)
    toggleModalStatus(true)
  }
  // 删除
  const deleteRow = async (user_ids) => {
    await userApi.manage.del({ user_ids: user_ids })
    message.success('删除成功')
    // 重新请求表格
    onParamChange({})
  }
  // 重置密码
  const resetPwd = (user_id) => {
    setEditType('reset')
    setUserId(user_id)
    toggleModalStatus(true)
  }
  /** 表单参数 */
  // 弹窗实例
  const userModalRef = useRef()
  // 功能类型
  const [editType, setEditType] = useState()
  // 当前行用户id
  const [user_id, setUserId] = useState()
  // 弹窗显隐切换
  const toggleModalStatus = (status) => {
    userModalRef.current.toggleShowStatus(status)
  }
  return (
    <>
      <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
      <Card>
        <Space>
          <AuthComponent permission="system:user:add" onClick={addRow}>
            新增
          </AuthComponent>
          {selectedRowKeys && selectedRowKeys.length > 0 && (
            <Popconfirm title="删除用户" description="确定要删除吗？" onConfirm={() => deleteRow(selectedRowKeys)}>
              <AuthComponent permission="system:user:del" danger>
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
        rowKey="user_id"
        bordered
        fetchMethod={userApi.manage.query}
        requestParam={requestParam}
        onParamChange={onParamChange}
      />
      <CustomModal title="用户编辑" ref={userModalRef}>
        <UserEditForm
          editType={editType}
          user_id={user_id}
          dict={{ statusDict }}
          onRefreshTable={onParamChange}
          toggleModalStatus={toggleModalStatus}
        />
      </CustomModal>
    </>
  )
}

export default User
