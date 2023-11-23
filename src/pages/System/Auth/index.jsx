import React, { useEffect, useRef, useState } from 'react'
import { Table, Space, Card, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
// 导入api
import authApi from '@/api/auth'
// 导入自定义字典hook
import useDict from '@/hooks/useDict'
// 导入组件
import SearchBar from '@/components/SearchBar'
import CustomModal from '@/components/CustomModal'
import AuthEditForm from './components/AuthEditForm'
import AuthComponent from '@/components/AuthComponent'

const Auth = () => {
  /** 所需字典 */
  // 权限显影，0显示，1隐藏
  const hiddenDict = useDict('hidden')
  // 权限类型
  const authTypeDict = useDict('authType')
  /** 搜索栏参数 */
  // 搜索栏表单项数组
  const formItemList = [
    { formItemProps: { name: 'title', label: '权限名称' }, valueCompProps: {} },
    { formItemProps: { name: 'path', label: '路由路径' }, valueCompProps: {} }
  ]
  /** 表格参数及表格配置 */
  const [requestParam, setRequestParam] = useState({})
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: '菜单标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (type) => {
        let color = ''
        switch (type) {
          case 'C':
            color = 'geekblue'
            break
          case 'B':
            color = 'red'
            break
          default:
            color = 'green'
            break
        }
        const filterItem = authTypeDict.find((item) => item.value === type)
        return filterItem ? <Tag color={color}>{filterItem.label}</Tag> : ''
      }
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      align: 'center'
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      align: 'center'
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      align: 'center'
    },
    {
      title: '显隐状态',
      dataIndex: 'hidden',
      key: 'hidden',
      render: (hidden) => {
        let color = hidden === '0' ? 'green' : 'red'
        const statusItem = hiddenDict.find((item) => item.value === hidden)
        return statusItem ? <Tag color={color}>{statusItem.label}</Tag> : ''
      },
      align: 'center'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
          {row.type !== 'B' && (
            <span onClick={() => addRow(row.menu_id)}>
              <AuthComponent permission="system:auth:add" type="link" title="新增">
                添加
              </AuthComponent>
            </span>
          )}
          <span onClick={() => editRow(row.menu_id)}>
            <AuthComponent permission="system:auth:edit" type="link" title="编辑">
              编辑
            </AuthComponent>
          </span>
          <Popconfirm title="删除菜单" description="确定要删除吗？" onConfirm={() => deleteRow(row.menu_id)}>
            <AuthComponent permission="system:auth:del" type="link" danger title="删除">
              删除
            </AuthComponent>
          </Popconfirm>
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
        title: undefined,
        type: undefined,
        path: undefined
      })
    else setRequestParam({ ...requestParam, ...searchParams })
  }
  const addRow = (auth_id = 0) => {
    setEditType('add')
    if (auth_id) setAuthId(auth_id)
    else setAuthId('')
    toggleModalStatus(true)
  }
  const editRow = async (auth_id) => {
    setEditType('edit')
    setAuthId(auth_id)
    toggleModalStatus(true)
  }
  const deleteRow = async (menu_id) => {
    await authApi.manage.del({ menu_id })
    fetchData()
  }
  const fetchData = async () => {
    setLoading(true)
    const { data } = await authApi.manage.query({
      ...requestParam
    })
    setData(data)
    setLoading(false)
  }
  /** 菜单编辑弹窗 */
  const [auth_id, setAuthId] = useState()
  const [editType, setEditType] = useState()
  const menuEditRef = useRef()
  const toggleModalStatus = (status) => {
    menuEditRef.current.toggleShowStatus(status)
  }
  useEffect(() => {
    fetchData()
  }, [requestParam])

  return (
    <>
      <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
      <Card>
        <Space>
          <AuthComponent permission="system:auth:add" onClick={() => addRow(0)}>
            新增
          </AuthComponent>
        </Space>
      </Card>
      <Table columns={columns} rowKey="menu_id" dataSource={data} bordered pagination={false} loading={loading} />
      <CustomModal title="权限编辑" ref={menuEditRef}>
        <AuthEditForm
          editType={editType}
          auth_id={auth_id}
          dict={{ hiddenDict, authTypeDict }}
          onRefreshTable={onParamChange}
          toggleModalStatus={toggleModalStatus}></AuthEditForm>
      </CustomModal>
    </>
  )
}
export default Auth
