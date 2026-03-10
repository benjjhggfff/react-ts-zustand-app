import React, { useState, useCallback, useMemo } from 'react'
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Table,
  Space,
  message,
  Modal,
  Form,
  Tag,
  Popconfirm,
  Switch,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

const { Option } = Select
const { Search } = Input

// ==================== Types ====================
interface User {
  id: string
  username: string
  nickname?: string
  phone: string
  email: string
  roleId: string
  roleName?: string
  status: 'enabled' | 'disabled'
  lastLoginAt?: string
}

interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: string[]
  userCount?: number
}

// ==================== Mock Data ====================
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    nickname: '管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    roleId: '1',
    roleName: '管理员',
    status: 'enabled',
    lastLoginAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '2',
    username: 'teacher1',
    nickname: '李老师',
    phone: '13800138001',
    email: 'teacher1@example.com',
    roleId: '2',
    roleName: '老师',
    status: 'enabled',
    lastLoginAt: '2026-03-08T15:30:00Z',
  },
  {
    id: '3',
    username: 'student1',
    nickname: '张三',
    phone: '13800138002',
    email: 'student1@example.com',
    roleId: '3',
    roleName: '学生',
    status: 'enabled',
    lastLoginAt: '2026-03-07T09:15:00Z',
  },
  {
    id: '4',
    username: 'student2',
    nickname: '李四',
    phone: '13800138003',
    email: 'student2@example.com',
    roleId: '3',
    roleName: '学生',
    status: 'enabled',
    lastLoginAt: '2026-03-06T14:20:00Z',
  },
  {
    id: '5',
    username: 'teacher2',
    nickname: '王老师',
    phone: '13800138004',
    email: 'teacher2@example.com',
    roleId: '2',
    roleName: '老师',
    status: 'enabled',
    lastLoginAt: '2026-03-05T11:10:00Z',
  },
  {
    id: '6',
    username: 'student3',
    nickname: '王五',
    phone: '13800138005',
    email: 'student3@example.com',
    roleId: '3',
    roleName: '学生',
    status: 'disabled',
    lastLoginAt: '2026-03-04T16:45:00Z',
  },
  {
    id: '7',
    username: 'admin2',
    nickname: '管理员2',
    phone: '13800138006',
    email: 'admin2@example.com',
    roleId: '1',
    roleName: '管理员',
    status: 'enabled',
    lastLoginAt: '2026-03-03T09:30:00Z',
  },
  {
    id: '8',
    username: 'student4',
    nickname: '赵六',
    phone: '13800138007',
    email: 'student4@example.com',
    roleId: '3',
    roleName: '学生',
    status: 'enabled',
    lastLoginAt: '2026-03-02T13:20:00Z',
  },
  {
    id: '9',
    username: 'teacher3',
    nickname: '张老师',
    phone: '13800138008',
    email: 'teacher3@example.com',
    roleId: '2',
    roleName: '老师',
    status: 'enabled',
    lastLoginAt: '2026-03-01T10:15:00Z',
  },
  {
    id: '10',
    username: 'student5',
    nickname: '孙七',
    phone: '13800138009',
    email: 'student5@example.com',
    roleId: '3',
    roleName: '学生',
    status: 'enabled',
    lastLoginAt: '2026-02-29T15:40:00Z',
  },
]

const MOCK_ROLES: Role[] = [
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

// ==================== Constants ====================
const STATUS_OPTIONS = [
  { value: 'enabled', label: '启用', color: 'green' },
  { value: 'disabled', label: '禁用', color: 'red' },
]

// ==================== Helper Functions ====================
const formatDateTime = (isoString?: string) => {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString()
}

// ==================== Main Component ====================
export default function UserListPage() {
  // ---------- State ----------
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS) // 完整数据源
  const [roles] = useState<Role[]>(MOCK_ROLES) // 角色数据（一般从全局或API获取）

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // ---------- Computed: Filtered Users ----------
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // 关键词匹配（用户名或手机号，不区分大小写）
      const keywordMatch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)

      // 角色筛选
      const roleMatch = !roleFilter || user.roleId === roleFilter

      // 状态筛选
      const statusMatch = !statusFilter || user.status === statusFilter

      return keywordMatch && roleMatch && statusMatch
    })
  }, [allUsers, searchTerm, roleFilter, statusFilter])

  // 当前页显示的数据
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, page, pageSize])

  // ---------- Callbacks ----------
  const handleSearch = useCallback(() => {
    // 点击搜索时，将页码重置为1（筛选条件已通过 useMemo 自动更新，这里只需重置页码）
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setSearchTerm('')
    setRoleFilter('')
    setStatusFilter('')
    setPage(1)
  }, [])

  const handleAddUser = useCallback(() => {
    setEditingUser(null)
    form.resetFields()
    // 设置默认值：状态为启用
    form.setFieldsValue({ status: true }) // 表单中 status 为 boolean
    setIsModalVisible(true)
  }, [form])

  const handleEditUser = useCallback(
    (user: User) => {
      setEditingUser(user)
      // 将字符串状态转换为 boolean 供 Switch 使用
      form.setFieldsValue({
        ...user,
        status: user.status === 'enabled',
      })
      setIsModalVisible(true)
    },
    [form]
  )

  const handleDeleteUser = useCallback((id: string) => {
    setLoading(true)
    // 模拟 API 调用
    setTimeout(() => {
      setAllUsers(prev => prev.filter(user => user.id !== id))
      message.success('用户已删除')
      setLoading(false)
    }, 500)
  }, [])

  const handleResetPassword = useCallback((username: string) => {
    message.success(`重置密码邮件已发送至用户 ${username}`)
  }, [])

  const handleUserSubmit = useCallback(() => {
    form
      .validateFields()
      .then(values => {
        setLoading(true)
        setTimeout(() => {
          // 转换 status：boolean -> 'enabled'/'disabled'
          const newUserData = {
            ...values,
            status: values.status ? 'enabled' : 'disabled',
            roleName: roles.find(role => role.id === values.roleId)?.name,
          }

          if (editingUser) {
            // 编辑：保留原有 ID 和 lastLoginAt
            setAllUsers(prev =>
              prev.map(user =>
                user.id === editingUser.id
                  ? { ...user, ...newUserData, id: editingUser.id, lastLoginAt: user.lastLoginAt }
                  : user
              )
            )
            message.success('用户已更新')
          } else {
            // 新增：生成新 ID
            const newId = String(allUsers.length + 1)
            const newUser: User = {
              ...newUserData,
              id: newId,
              lastLoginAt: undefined,
            }
            setAllUsers(prev => [...prev, newUser])
            message.success('用户已添加')
          }
          setIsModalVisible(false)
          setLoading(false)
        }, 500)
      })
      .catch(info => {
        console.log('表单验证失败:', info)
      })
  }, [editingUser, allUsers.length, roles])

  // ---------- Table Columns (memoized) ----------
  const userColumns = useMemo(
    () => [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const option = STATUS_OPTIONS.find(opt => opt.value === status)
          return <Tag color={option?.color}>{option?.label}</Tag>
        },
      },
      {
        title: '最后登录时间',
        dataIndex: 'lastLoginAt',
        key: 'lastLoginAt',
        render: formatDateTime,
      },
      {
        title: '操作',
        key: 'action',
        width: 280,
        render: (_: any, record: User) => (
          <Space size="middle">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定要删除该用户吗？"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确定要重置该用户密码吗？"
              onConfirm={() => handleResetPassword(record.username)}
              okText="确定"
              cancelText="取消"
            >
              <Button icon={<LockOutlined />}>重置密码</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleEditUser, handleDeleteUser, handleResetPassword]
  )

  return (
    <div className={styles['user-list']}>
      <Card className={styles['user-card']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>用户列表</h2>
          <p className={styles['section-desc']}>管理系统用户，包括新增、编辑、删除和重置密码</p>
        </div>

        {/* ---------- 搜索筛选区 ---------- */}
        <div className={styles['search-filter']}>
          <Row gutter={16}>
            <Col span={8}>
              <Search
                placeholder="请输入用户名/手机号"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                enterButton
                allowClear
                className={styles['search-input']}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="按角色筛选"
                value={roleFilter}
                onChange={setRoleFilter}
                allowClear
                style={{ width: '100%' }}
                className={styles['filter-select']}
              >
                {roles.map(role => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="按状态筛选"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: '100%' }}
                className={styles['filter-select']}
              >
                {STATUS_OPTIONS.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Space style={{ float: 'right' }}>
                <Button onClick={handleReset} className={styles['reset-button']}>
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddUser}
                  className={styles['add-button']}
                >
                  新增用户
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* ---------- 用户表格 ---------- */}
        <div className={styles['table-container']}>
          <Table
            columns={userColumns}
            dataSource={paginatedUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: filteredUsers.length,
              onChange: (newPage, newPageSize) => {
                setPage(newPage)
                setPageSize(newPageSize)
              },
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: total => `共 ${total} 个用户`,
            }}
            className={styles['user-table']}
          />
        </div>
      </Card>

      {/* ---------- 新增/编辑用户弹窗 ---------- */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleUserSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        confirmLoading={loading}
        destroyOnClose
        className={styles['user-modal']}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }} // 新增时默认启用
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled={!!editingUser} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色">
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked" // Switch 的 checked 属性绑定到该字段
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
