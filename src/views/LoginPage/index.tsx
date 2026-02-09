import React, { useState } from 'react'
import styles from './Login.module.scss'
import { Input, Form, Checkbox, message } from 'antd'
import type { FormProps } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { loginAsync, fetchUserInfo } from '../../store/modules/userStore'
import type { LoginParams } from '../../constants/index'
import type { RootState } from '../../store/type'
import { useNavigate } from 'react-router-dom'

// 定义表单字段类型
type FieldType = {
  username: string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.user)
  const [currentForm, setCurrentForm] = useState<'login' | 'register'>('login')

  // 使用 Form 实例
  const [form] = Form.useForm<FieldType>()

  const switchForm = (formType: 'login' | 'register') => {
    setCurrentForm(formType)
    form.resetFields()
  }

  // 登录处理
  const handleLogin: FormProps<FieldType>['onFinish'] = async values => {
    try {
      const loginParams: LoginParams = {
        userId: values.username,
        password: values.password,
      }

      // 登录请求
      const result = await dispatch(loginAsync(loginParams)).unwrap()
      console.log('登录结果:', result) // 调试输出登录结果
      // 根据实际API返回结构调整
      if (result) {
        // 获取用户信息
        await dispatch(fetchUserInfo()).unwrap()
        message.success('登录成功！')
        navigate('/home')
      }
    } catch (err: any) {
      // 错误处理
      const errorMsg = err?.message || err?.msg || '登录失败，请重试'
      message.error(errorMsg)
    }
  }

  // 表单校验失败处理
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
    console.log('表单校验失败:', errorInfo)
    message.error('请完善表单信息')
  }

  // 注册处理（简化版）
  const handleRegister: FormProps<any>['onFinish'] = async values => {
    try {
      message.success('注册成功！请登录')
      switchForm('login')
    } catch (err: any) {
      message.error(err?.message || '注册失败')
    }
  }

  return (
    <div className={styles.LoginPage}>
      {/* 登录表单 */}
      {currentForm === 'login' && (
        <section
          className={`${styles.LoginForm} ${currentForm === 'login' ? styles.FormActive : styles.FormInactive}`}
        >
          <h2 className={styles.Welcome}>WELCOME</h2>
          <Form<FieldType>
            form={form}
            name="login_form"
            onFinish={handleLogin}
            onFinishFailed={onFinishFailed}
            initialValues={{ remember: true }}
            className={styles.InputWrap}
          >
            <div className={styles.Username}>
              <Form.Item<FieldType>
                name="username"
                rules={[{ required: true, message: '请输入工号/学号！' }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  type="text"
                  placeholder="Username"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </div>

            <div className={styles.Password}>
              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  placeholder="Password"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  prefix={<LockOutlined />}
                />
              </Form.Item>
            </div>

            <div className={styles.Options}>
              <div className="">
                <Form.Item<FieldType>
                  name="remember"
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox style={{ padding: 0, marginRight: 8 }} />
                </Form.Item>
                <label
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    const current = form.getFieldValue('remember')
                    form.setFieldValue('remember', !current)
                  }}
                >
                  Remember me
                </label>
              </div>

              <a href="#" onClick={e => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '登录中...' : 'Login'}
              </button>
            </Form.Item>
          </Form>

          <div className={styles.SignUp}>
            Don't have an account?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                switchForm('register')
              }}
            >
              Sign Up
            </a>
          </div>
        </section>
      )}

      {/* 注册表单 */}
      {currentForm === 'register' && (
        <section
          className={`${styles.RegisterForm} ${currentForm === 'register' ? styles.FormActive : styles.FormInactive}`}
        >
          <h2 className={styles.Welcome}>SIGN UP</h2>
          <Form onFinish={handleRegister} className={styles.InputWrap}>
            <div className={styles.Username}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名！' }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  type="text"
                  placeholder="Username"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </div>

            <div className={styles.Password}>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  placeholder="Password"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  prefix={<LockOutlined />}
                />
              </Form.Item>
            </div>

            <div className={styles.Password}>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码！' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    },
                  }),
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  placeholder="Confirm Password"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  prefix={<LockOutlined />}
                />
              </Form.Item>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <button type="submit" style={{ width: '100%', cursor: 'pointer' }}>
                Register
              </button>
            </Form.Item>
          </Form>

          <div className={styles.SignUp}>
            Already have an account?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                switchForm('login')
              }}
            >
              Sign In
            </a>
          </div>
        </section>
      )}
    </div>
  )
}
