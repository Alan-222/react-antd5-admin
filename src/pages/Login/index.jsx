import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { message } from 'antd'

import classes from './Login.module.scss'
// 导入api
import userApi from '@/api/user'
import { loginAsync } from '@/store/reducers/userSlice'
// 导入加密解密方法
import { encrypt, decrypt } from '@/utils/jsencrypt'

const Login = () => {
  // redux hook
  const dispatch = useDispatch()
  // router hook
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.preLocation?.pathname || '/home'
  /** 登录表单参数与方法 */
  // 获取antd的form实例
  const [form] = Form.useForm()
  // 按钮loading
  const [loading, setLoading] = useState(false)
  // 验证码uuid
  const [uuid, setUuid] = useState()
  // 验证码svg标签
  const [verifyImg, setVerifyImg] = useState()

  const onFinish = async (values) => {
    // 开始loading
    setLoading(true)
    // 记住密码存储用户信息
    if (values.remember) {
      localStorage.setItem('username', values.username, { expires: 7 })
      localStorage.setItem('password', encrypt(values.password), { expires: 7 })
      localStorage.setItem('remember', values.remember, { expires: 7 })
    } else {
      // 移除用户信息
      localStorage.removeItem('username')
      localStorage.removeItem('password')
      localStorage.removeItem('remember')
    }
    try {
      await dispatch(loginAsync({ ...values, uuid }))
      setLoading(false)
      // 若上次为登录页，跳转到首页
      if (from === '/login') navigate('/home', { replace: true })
      else navigate(from, { replace: true })
      message.success('登录成功！')
    } catch (e) {
      console.error(e)
      getCode()
      setLoading(false)
    }
  }

  // 登录页显示欢迎语
  const [welcomeText, setWelcomeText] = useState('')
  const typeWriter = (wordSplit, index) => {
    if (index < wordSplit.length - 1) {
      setWelcomeText((pre) => {
        index++
        return pre + wordSplit[index]
      })
      setTimeout(() => typeWriter(wordSplit, index), 200)
    }
  }
  // 获取验证码
  const getCode = () => {
    const uuid = new Date().getTime()
    setUuid(uuid)
    userApi.login.get(uuid).then((res) => {
      setVerifyImg(res.data)
    })
  }

  // 获取缓存中的用户名密码信息
  const getUser = () => {
    const username = localStorage.getItem('username') ?? ''
    const password = localStorage.getItem('password') ?? ''
    const remember = localStorage.getItem('remember') ?? false
    // 通过antd表单实例对象的setFieldsValue方法回显值
    form.setFieldsValue({
      username,
      password: decrypt(password),
      remember: Boolean(remember)
    })
  }

  useEffect(() => {
    let index = -1
    const wordSplit = 'Welcome'.split('')
    typeWriter(wordSplit, index)
    getCode()
    getUser()
  }, [])

  return (
    <div className={classes.login}>
      <div className={classes['login-container']}>
        <div className={classes['login-text']}>{welcomeText}</div>
        <div className={classes['login-form']}>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: false }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item label="用户名" name="username" rules={[{ required: true, max: 12, message: '请输入用户名!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="验证码"
              name="checkCode"
              rules={[{ required: true, min: 4, max: 4, message: '请输入正确格式验证码!' }]}>
              <Input
                suffix={
                  <div
                    dangerouslySetInnerHTML={{ __html: verifyImg }}
                    className="login-captcha"
                    onClick={() => getCode()}></div>
                }
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                登录
              </Button>
              <Button htmlType="reset" style={{ marginLeft: '32px' }}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
export default Login
