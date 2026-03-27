// UserEditModal.tsx
import React from 'react'
import { Modal, Form, Input, Button, Space } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

interface Props {
  isEditing: boolean
  form: any
  onCancel: () => void
  onSave: () => void
}

export default function UserEditModal({ isEditing, form, onCancel, onSave }: Props) {
  return (
    <Modal title="编辑个人资料" open={isEditing} onCancel={onCancel} footer={null} width={600}>
      <Form
        form={form}
        layout="horizontal"
        onFinish={onSave}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="用户名" name="name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true }, { pattern: /^1[3-9]\d{9}$/ }]}
        >
          <Input prefix={<PhoneOutlined />} />
        </Form.Item>
        <Form.Item label="真实姓名" name="real_name" rules={[{ required: true }]}>
          <Input prefix={<IdcardOutlined />} />
        </Form.Item>
        <Form.Item label="身份证号" name="id_card" rules={[{ required: true }]}>
          <Input prefix={<SafetyCertificateOutlined />} />
        </Form.Item>
        <Form.Item name="avatar" hidden>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Space size="large">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
