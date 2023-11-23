import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message, Select, Radio } from 'antd'
// 导入api
import userApi from '@/api/user'
import roleApi from '@/api/role'
export default function UserEditForm({ editType, user_id, dict, onRefreshTable, toggleModalStatus }) {
  // 表单组件实例
  const [form] = Form.useForm()
  // 表单数据
  const [allRoleArr, setAllRoleArr] = useState([])
  // 取消按钮事件
  const onCancel = () => {
    toggleModalStatus(false)
    form.resetFields()
  }
  // 提交按钮事件
  const onFinish = async (value) => {
    // 根据不同类型编辑类型，请求不同接口
    switch (editType) {
      case 'add':
        await userApi.manage.add(value)
        message.success('添加用户成功')
        break
      case 'edit':
        await userApi.manage.update({ user_id, ...value })
        message.success('修改信息成功')
        break
      case 'reset':
        await userApi.manage.reset({ user_id, ...value })
        message.success('重置密码成功')
        break
      default:
        console.log(editType)
    }
    onCancel()
    // 刷新表格
    if (editType !== 'reset') onRefreshTable({})
    form.resetFields()
  }

  useEffect(() => {
    // 进来先重置表单
    form && form.resetFields()
    // 请求角色选项数组
    if (editType !== 'reset' && !allRoleArr.length) {
      const fetchAllRole = async () => {
        const { data } = await roleApi.manage.queryAll()
        const filterArr = data.map((item) => ({ role_id: item.role_id, role_name: item.role_name }))
        setAllRoleArr(filterArr)
      }
      fetchAllRole()
    }
    // 请求当前用户id的信息
    if (editType === 'edit') {
      const fetchCurrentData = async () => {
        const {
          data: { username, roles, status }
        } = await userApi.manage.queryById(user_id)
        // 回显值
        form.setFieldsValue({
          username,
          role_ids: roles.map((item) => item.role_id),
          status
        })
      }
      fetchCurrentData()
    }
  }, [editType, user_id])
  return (
    <Form form={form} layout="vertical" name="userInfoForm" onFinish={onFinish}>
      {editType !== 'reset' && (
        <>
          <Form.Item name="username" label="用户名" rules={[{ required: true, type: 'string', min: 1, max: 10 }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="role_ids"
            label="角色"
            rules={[{ required: true, message: '请选择一个或多个角色', type: 'array' }]}>
            <Select mode="multiple">
              {allRoleArr &&
                allRoleArr.map((item) => (
                  <Select.Option value={item.role_id} key={item.role_id}>
                    {item.role_name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, type: 'string' }]}>
            <Radio.Group buttonStyle="solid">
              {dict.statusDict.map((item) => (
                <Radio.Button value={item.value} key={item.value}>
                  {item.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </>
      )}
      {editType === 'reset' && (
        <Form.Item name="old_password" label="旧密码" rules={[{ required: true, type: 'string', min: 6, max: 15 }]}>
          <Input.Password />
        </Form.Item>
      )}
      {editType !== 'edit' && (
        <>
          <Form.Item name="password" label="密码" rules={[{ required: true, type: 'string', min: 6, max: 15 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="repassword"
            label="确认密码"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject('两次密码不一致!')
                }
              })
            ]}>
            <Input.Password />
          </Form.Item>
        </>
      )}
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 32 }}>
          确认
        </Button>
      </Form.Item>
    </Form>
  )
}
