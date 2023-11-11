import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setUserinfo } from '@/store/reducers/userSlice'
// 导入api
import userApi from '@/api/user'

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const UserCenterForm = (props) => {
  // 分发方法
  const dispatch = useDispatch()
  // 获取token
  const token = useSelector((state) => state.user.token)
  // 获取当前登录用户信息
  const userinfo = useSelector((state) => state.user.userinfo)
  // 获取当前登录用户的id
  const user_id = useSelector((state) => state.user.userinfo.user_id)
  // 上传及表单组件
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  // upload组件回显图片
  const [imageUrl, setImageUrl] = useState()

  /** 图片上传参数及方法 */
  const uploadUrl =
    process.env.NODE_ENV === 'development' ? '/api/user/myInfo/updateAvatar' : '/user/myInfo/updateAvatar'
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8
        }}>
        Upload
      </div>
    </div>
  )

  const onCancel = () => {
    // form.resetFields()
    props.toggleCenterStatus(false)
  }
  const onFinish = async (value) => {
    await userApi.center.update(value)
    // 更新全局状态
    dispatch(setUserinfo({ ...userinfo, ...value, avatar: imageUrl }))
    message.success('修改信息成功')
    onCancel()
  }

  useEffect(() => {
    // 获取当前登录用户信息回显
    const fetchUserInfo = async () => {
      const {
        data: { name, nickname, email, avatar }
      } = await userApi.center.get(user_id)
      form.setFieldsValue({
        name,
        nickname,
        email
      })
      if (avatar) setImageUrl(process.env.React_APP_IMG_API + '/' + avatar)
    }
    fetchUserInfo()
  }, [form, user_id])
  return (
    <>
      <div style={{ marginBottom: 10 }}>头像</div>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        headers={{ Authorization: token }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        style={{ textAlign: 'center' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%'
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      {/* 其余表单项 */}
      <Form form={form} layout="vertical" name="userCenterForm" onFinish={onFinish}>
        <Form.Item name="name" label="用户名" rules={[{ type: 'string', min: 1, max: 10 }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ type: 'string' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ type: 'email' }]}>
          <Input />
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
export default UserCenterForm
