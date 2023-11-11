import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// 导入api
import userApi from '@/api/user'
// 导入全局登出方法
import { logout } from '@/store/reducers/userSlice'

export default function ResetPwdForm(props) {
  const user_id = useSelector((state) => state.user.userinfo.user_id)
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const navigate = useNavigate()
  const location = useLocation()

  const onCancel = () => {
    form.resetFields()
    props.toggleResetStatus(false)
  }
  const onFinish = async (value) => {
    await userApi.manage.reset({ user_id, ...value })
    message.success('重置密码成功')
    props.toggleResetStatus(false)
    form.resetFields()
    // 重新登录
    dispatch(logout())
    navigate('/login', { replace: true, state: { preLocation: location } })
  }
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="resetPwdForm"
        // initialValues={{ oldPasswordL: '', newPassword: '', confirmPassword: '' }}
        onFinish={onFinish}>
        <Form.Item name="old_password" label="旧密码" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="password" label="新密码" rules={[{ required: true, type: 'string', min: 6, max: 10 }]}>
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
                return Promise.reject('两次新密码不一致!')
              }
            })
          ]}>
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 32 }}>
            确认
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
