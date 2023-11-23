import React, { useEffect } from 'react'
import { Form, Input, Button, message, Radio } from 'antd'
// 导入api
import roleApi from '@/api/role'

export default function RoleEditForm({ role_id, dict, onRefreshTable, toggleModalStatus }) {
  // 表单组件
  const [form] = Form.useForm()
  const onCancel = () => {
    toggleModalStatus(false)
  }
  // 表单提交
  const onFinish = async (value) => {
    if (role_id) {
      await roleApi.manage.update(role_id, value)
      message.success('修改信息成功')
    } else {
      await roleApi.manage.add(value)
      message.success('添加成功')
    }
    onCancel()
    onRefreshTable({})
  }

  useEffect(() => {
    form && form.resetFields()
    if (role_id) {
      const fetchCurrentData = async () => {
        const {
          data: { role_name, remark, status }
        } = await roleApi.manage.queryById(role_id)
        // 回显值
        form.setFieldsValue({
          role_name,
          remark,
          status
        })
      }
      fetchCurrentData()
    }
  }, [role_id])
  return (
    <Form form={form} layout="vertical" name="roleEditForm" onFinish={onFinish}>
      <Form.Item name="role_name" label="角色名称" rules={[{ required: true, type: 'string', min: 1, max: 10 }]}>
        <Input />
      </Form.Item>
      <Form.Item name="remark" label="角色描述" rules={[{ required: true, type: 'string' }]}>
        <Input />
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
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 32 }}>
          确认
        </Button>
      </Form.Item>
    </Form>
  )
}
