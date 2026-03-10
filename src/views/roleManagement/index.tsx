import React, { useState } from 'react'
import { Button, Card, Table, Space, message, Modal, Form, Input } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

// Define types
interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: string[]
  userCount?: number
}

// Fixed permissions list
const PERMISSIONS = [
  { label: '用户管理', value: 'user:manage' },
  { label: '角色管理', value: 'role:manage' },
  { label: '系统监控', value: 'system:monitor' },
]

// Mock data
const mockRoles: Role[] = [
  {
    id: '1',
    name: '管理员',
    code: 'admin',
    description: '拥有所有权限，包括用户管理、角色管理和系统监控',
    permissions: ['user:manage', 'role:manage', 'system:monitor'],
    userCount: 2,
  },
  {
    id: '2',
    name: '老师',
    code: 'teacher',
    description: '拥有课程管理和学生管理权限',
    permissions: [],
    userCount: 3,
  },
  {
    id: '3',
    name: '学生',
    code: 'student',
    description: '拥有查看个人信息和课程的权限',
    permissions: [],
    userCount: 5,
  },
]

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roleForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Handle add role
  const handleAddRole = () => {
    setEditingRole(null)
    roleForm.resetFields()
    setIsModalVisible(true)
  }

  // Handle edit role
  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    roleForm.setFieldsValue(role)
    setIsModalVisible(true)
  }

  // Handle delete role
  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id)
    if (role && role.userCount && role.userCount > 0) {
      message.error('该角色下存在用户，无法删除')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setRoles(roles.filter(role => role.id !== id))
      message.success('角色已删除')
      setLoading(false)
    }, 500)
  }

  // Handle role form submission
  const handleRoleSubmit = () => {
    roleForm.validateFields().then(values => {
      setLoading(true)
      setTimeout(() => {
        if (editingRole) {
          // Edit existing role
          setRoles(roles.map(role => 
            role.id === editingRole.id ? { ...role, ...values } : role
          ))
          message.success('角色已更新')
        } else {
          // Add new role
          const newRole: Role = {
            ...values,
            id: String(roles.length + 1),
            userCount: 0,
          }
          setRoles([...roles, newRole])
          message.success('角色已添加')
        }
        setIsModalVisible(false)
        setLoading(false)
      }, 500)
    })
  }

  // Role table columns
  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '标识',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditRole(record)}>编辑</Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteRole(record.id)}
            disabled={record.userCount && record.userCount > 0}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles['role-management']}>
      <Card className={styles['role-card']}>
        <div className={styles['role-header-section']}>
          <h2 className={styles['role-title']}>角色管理</h2>
          <p className={styles['role-desc']}>管理系统角色类型，包括新增、编辑、删除和权限分配</p>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole} className={styles['add-role-button']}>
            新增角色
          </Button>
        </div>

        {/* Role table */}
        <div className={styles['role-table-container']}>
          <Table
            columns={roleColumns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: roles.length,
              onChange: (page, pageSize) => {
                setPage(page)
                setPageSize(pageSize)
              },
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 个角色`
            }}
            className={styles['role-table']}
          />
        </div>
      </Card>

      {/* Role Modal */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleRoleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        className={styles['role-modal']}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="标识"
            rules={[
              { required: true, message: '请输入角色标识' },
              { pattern: /^[a-z_]+$/, message: '只允许小写字母和下划线' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限"
          >
            <div>
              {PERMISSIONS.map(permission => (
                <Form.Item key={permission.value} noStyle>
                  <Form.Checkbox 
                    checked={roleForm.getFieldValue('permissions')?.includes(permission.value)}
                    onChange={(e) => {
                      const currentPermissions = roleForm.getFieldValue('permissions') || []
                      if (e.target.checked) {
                        roleForm.setFieldsValue({ 
                          permissions: [...currentPermissions, permission.value] 
                        })
                      } else {
                        roleForm.setFieldsValue({ 
                          permissions: currentPermissions.filter(p => p !== permission.value) 
                        })
                      }
                    }}
                  >
                    {permission.label}
                  </Form.Checkbox>
                </Form.Item>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
