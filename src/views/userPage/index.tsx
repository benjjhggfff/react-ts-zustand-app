import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Form, Input, message, Avatar, Tabs } from 'antd'
const { TabPane } = Tabs
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../../store/index'
import { fetchUserInfo } from '../../store/modules/userStore'
import { updateUserProfileApi } from '../../api/user'
import './userPage.scss'

const { TextArea } = Input

export default function UserPage() {
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector(state => state.user)
  const [activeTab, setActiveTab] = useState('base')
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()

  // 初始化获取用户信息
  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUserInfo())
    }
  }, [dispatch, userInfo])

  // 处理编辑个人资料
  const handleEdit = () => {
    setIsEditing(true)
    // 填充表单数据
    form.setFieldsValue({
      name: userInfo?.name,
      phone: userInfo?.phone,
      real_name: userInfo?.real_name,
      id_card: userInfo?.id_card,
    })
  }

  // 处理保存个人资料
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const result = await updateUserProfileApi(values)
      if (result.code === 200) {
        message.success('个人资料更新成功')
        dispatch(fetchUserInfo()) // 重新获取用户信息
        setIsEditing(false)
      }
    } catch (error) {
      message.error('更新失败，请重试')
    }
  }

  // 处理取消编辑
  const handleCancel = () => {
    setIsEditing(false)
    form.resetFields()
  }

  return (
    <div className="user-page">
      {/* 个人资料卡片 */}
      <Card className="profile-card">
        <Row gutter={24} align="middle">
          <Col span={6}>
            <Avatar
              size={120}
              src={
                userInfo?.avatar ||
                'https://ts1.tc.mm.bing.net/th/id/OIP-C.SWWmUtJk_k7PS8U6DyrxQQAAAA?w=204&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.9&pid=3.1&rm=2'
              }
              icon={<UserOutlined />}
              className="avatar"
            />
          </Col>
          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="info-item">
                  <span className="label">用户名：</span>
                  <span className="value">{userInfo?.name || '未设置'}</span>
                </div>
                <div className="info-item">
                  <span className="label">账号ID：</span>
                  <span className="value">{userInfo?.id || '未设置'}</span>
                </div>
                <div className="info-item">
                  <span className="label">注册时间：</span>
                  <span className="value">
                    {userInfo?.created_at
                      ? new Date(userInfo.created_at).toLocaleString()
                      : '未设置'}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className="info-item">
                  <span className="label">实名认证：</span>
                  <span className="value">{userInfo?.verified ? '已认证' : '未认证'}</span>
                </div>
                <div className="info-item">
                  <span className="label">手机号码：</span>
                  <span className="value">{userInfo?.phone || '未设置'}</span>
                </div>
                <div className="info-item">
                  <span className="label">邮箱：</span>
                  <span className="value">{userInfo?.email || '未设置'}</span>
                </div>
              </Col>
            </Row>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{ marginTop: 16 }}
            >
              修改个人资料
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 编辑表单 */}
      {isEditing && (
        <Card className="edit-form-card" title="修改个人资料">
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="用户名"
                  name="name"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="手机号码"
                  name="phone"
                  rules={[{ required: true, message: '请输入手机号码' }]}
                >
                  <Input placeholder="请输入手机号码" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="真实姓名"
                  name="real_name"
                  rules={[{ required: true, message: '请输入真实姓名' }]}
                >
                  <Input placeholder="请输入真实姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="身份证号"
                  name="id_card"
                  rules={[{ required: true, message: '请输入身份证号' }]}
                >
                  <Input placeholder="请输入身份证号" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {/* 标签页 */}
      <Card className="tab-card" style={{ marginTop: 24 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基础信息" key="base">
            <Row gutter={24}>
              <Col span={12}>
                <div className="base-info-item">
                  <span className="label">用户ID：</span>
                  <span className="value">{userInfo?.id || '未设置'}</span>
                </div>
                <div className="base-info-item">
                  <span className="label">用户名：</span>
                  <span className="value">{userInfo?.name || '未设置'}</span>
                </div>
                <div className="base-info-item">
                  <span className="label">邮箱：</span>
                  <span className="value">{userInfo?.email || '未设置'}</span>
                </div>
                <div className="base-info-item">
                  <span className="label">注册时间：</span>
                  <span className="value">
                    {userInfo?.created_at
                      ? new Date(userInfo.created_at).toLocaleString()
                      : '未设置'}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className="base-info-item">
                  <span className="label">真实姓名：</span>
                  <span className="value">{userInfo?.real_name || '未设置'}</span>
                </div>
                <div className="base-info-item">
                  <span className="label">手机号码：</span>
                  <span className="value">{userInfo?.phone || '未设置'}</span>
                </div>
                <div className="base-info-item">
                  <span className="label">身份证号：</span>
                  <span className="value">{userInfo?.id_card || '未设置'}</span>
                </div>
                <div className="base-info-item">
                  <span className="label">实名认证状态：</span>
                  <span className="value">{userInfo?.verified ? '已认证' : '未认证'}</span>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="安全设置" key="security">
            <div className="security-item">
              <div className="security-item-header">
                <span className="security-item-name">登录密码</span>
                <span className="security-item-status">已设置</span>
              </div>
              <div className="security-item-desc">
                密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。
              </div>
              <Button type="link">修改密码</Button>
            </div>
            <div className="security-item">
              <div className="security-item-header">
                <span className="security-item-name">密保问题</span>
                <span className="security-item-status">未设置</span>
              </div>
              <div className="security-item-desc">
                请定期更换密保问题，并确保问题答案的保密性，以防账号被盗用。
              </div>
              <Button type="link">设置密保问题</Button>
            </div>
            <div className="security-item">
              <div className="security-item-header">
                <span className="security-item-name">安全手机</span>
                <span className="security-item-status">
                  {userInfo?.phone ? '已绑定' : '未绑定'}
                </span>
              </div>
              <div className="security-item-desc">
                {userInfo?.phone ? `已绑定：${userInfo.phone}` : '绑定手机可以提高账号安全性'}
              </div>
              <Button type="link">{userInfo?.phone ? '修改绑定' : '绑定手机'}</Button>
            </div>
            <div className="security-item">
              <div className="security-item-header">
                <span className="security-item-name">安全邮箱</span>
                <span className="security-item-status">已绑定</span>
              </div>
              <div className="security-item-desc">已绑定：{userInfo?.email || '未设置'}</div>
              <Button type="link">修改绑定</Button>
            </div>
          </TabPane>
          <TabPane tab="实名认证" key="verification">
            <div className="verification-content">
              <div className="verification-status">
                <span className="status-label">实名认证状态：</span>
                <span className={`status-value ${userInfo?.verified ? 'verified' : 'unverified'}`}>
                  {userInfo?.verified ? '已认证' : '未认证'}
                </span>
              </div>
              {!userInfo?.verified && (
                <div className="verification-form">
                  <Form layout="vertical">
                    <Form.Item
                      label="真实姓名"
                      rules={[{ required: true, message: '请输入真实姓名' }]}
                    >
                      <Input placeholder="请输入真实姓名" />
                    </Form.Item>
                    <Form.Item
                      label="身份证号"
                      rules={[{ required: true, message: '请输入身份证号' }]}
                    >
                      <Input placeholder="请输入身份证号" />
                    </Form.Item>
                    <Form.Item
                      label="上传身份证照片"
                      rules={[{ required: true, message: '请上传身份证照片' }]}
                    >
                      <Input type="file" accept="image/*" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        提交认证
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
