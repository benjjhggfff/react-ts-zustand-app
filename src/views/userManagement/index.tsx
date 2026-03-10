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
  Checkbox,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

const { Option } = Select
const { Search } = Input

// ==================== Types ====================
interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: string[]
  userCount?: number
}

// ==================== Mock Data ====================
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
const PERMISSIONS = [
  { label: '用户管理', value: 'user:manage' },
  { label: '角色管理', value: 'role:manage' },
  { label: '系统监控', value: 'system:monitor' },
]

// ==================== Main Component ====================
export default function RoleManagementPage() {
  // ---------- 基础状态（完全对齐 UserListPage 写法） ----------
  const [allRoles, setAllRoles] = useState<Role[]>(MOCK_ROLES) // 完整角色数据源
  const [searchTerm, setSearchTerm] = useState('') // 角色搜索关键词
  const [page, setPage] = useState(1) // 分页页码
  const [pageSize, setPageSize] = useState(10) // 分页大小
  const [isModalVisible, setIsModalVisible] = useState(false) // 角色弹窗显隐
  const [editingRole, setEditingRole] = useState<Role | null>(null) // 编辑的角色
  const [form] = Form.useForm() // 角色表单实例
  const [loading, setLoading] = useState(false) // 加载状态

  // ---------- 计算属性：过滤+分页后的角色数据 ----------
  const filteredRoles = useMemo(() => {
    return allRoles.filter(role => {
      // 按角色名称/标识搜索（不区分大小写）
      const keywordMatch =
        !searchTerm ||
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.code.toLowerCase().includes(searchTerm.toLowerCase())
      return keywordMatch
    })
  }, [allRoles, searchTerm])

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRoles.slice(start, start + pageSize)
  }, [filteredRoles, page, pageSize])

  // ---------- 回调函数（完全对齐 UserListPage 写法） ----------
  const handleSearch = useCallback(() => {
    // 搜索时重置页码
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setSearchTerm('')
    setPage(1)
  }, [])

  const handleAddRole = useCallback(() => {
    setEditingRole(null)
    form.resetFields()
    // 新增时设置权限默认值（对齐 UserListPage 的默认值写法）
    form.setFieldsValue({ permissions: [] })
    setIsModalVisible(true)
  }, [form])

  const handleEditRole = useCallback(
    (role: Role) => {
      setEditingRole(role)
      // 直接赋值，无需转换（权限字段是数组，可直接绑定）
      form.setFieldsValue(role)
      setIsModalVisible(true)
    },
    [form]
  )

  const handleDeleteRole = useCallback((id: string) => {
    const role = allRoles.find(r => r.id === id)
    if (role?.userCount && role.userCount > 0) {
      message.error('该角色下存在用户，无法删除')
      return
    }

    setLoading(true)
    // 模拟 API 调用（对齐 UserListPage 的 setTimeout 写法）
    setTimeout(() => {
      setAllRoles(prev => prev.filter(role => role.id !== id))
      message.success('角色已删除')
      setLoading(false)
    }, 500)
  }, [allRoles])

  const handleRoleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(values => {
        setLoading(true)
        setTimeout(() => {
          if (editingRole) {
            // 编辑角色：保留原有 ID 和 userCount
            setAllRoles(prev =>
              prev.map(role =>
                role.id === editingRole.id
                  ? { ...role, ...values, id: editingRole.id, userCount: role.userCount }
                  : role
              )
            )
            message.success('角色已更新')
          } else {
            // 新增角色：生成新 ID，默认用户数为 0
            const newId = String(allRoles.length + 1)
            const newRole: Role = {
              ...values,
              id: newId,
              userCount: 0,
            }
            setAllRoles(prev => [...prev, newRole])
            message.success('角色已添加')
          }
          setIsModalVisible(false)
          setLoading(false)
        }, 500)
      })
      .catch(info => {
        console.log('表单验证失败:', info)
      })
  }, [editingRole, allRoles.length, form])

  // ---------- 表格列配置（对齐 UserListPage 的 useMemo 写法） ----------
  const roleColumns = useMemo(
    () => [
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
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditRole(record)}>
              编辑
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRole(record.id)}
              disabled={!!record.userCount && record.userCount > 0}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [handleEditRole, handleDeleteRole]
  )

  // ---------- 渲染（完全对齐 UserListPage 的结构） ----------
  return (
    <div className={styles['role-list']}>
      <Card className={styles['role-card']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>角色列表</h2>
          <p className={styles['section-desc']}>管理系统角色类型，包括新增、编辑、删除和权限分配</p>
        </div>

        {/* ---------- 搜索筛选区（简化版，对齐 UserListPage 结构） ---------- */}
        <div className={styles['search-filter']}>
          <Row gutter={16}>
            <Col span={12}>
              <Search
                placeholder="请输入角色名称/标识"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                enterButton
                allowClear
                className={styles['search-input']}
              />
            </Col>
            <Col span={12}>
              <Space style={{ float: 'right' }}>
                <Button onClick={handleReset} className={styles['reset-button']}>
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddRole}
                  className={styles['add-button']}
                >
                  新增角色
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* ---------- 角色表格 ---------- */}
        <div className={styles['table-container']}>
          <Table
            columns={roleColumns}
            dataSource={paginatedRoles}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: filteredRoles.length,
              onChange: (newPage, newPageSize) => {
                setPage(newPage)
                setPageSize(newPageSize)
              },
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: total => `共 ${total} 个角色`,
            }}
            className={styles['role-table']}
          />
        </div>
      </Card>

      {/* ---------- 新增/编辑角色弹窗（核心修复：对齐 UserListPage 模态框写法） ---------- */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleRoleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        confirmLoading={loading}
        destroyOnClose // 关闭时销毁表单，避免缓存
        className={styles['role-modal']}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ permissions: [] }} // 新增时默认权限为空数组
        >
          {/* 角色名称（必填，对齐 UserListPage 的表单验证写法） */}
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          {/* 角色标识（必填+格式验证） */}
          <Form.Item
            name="code"
            label="角色标识"
            rules={[
              { required: true, message: '请输入角色标识' },
              { pattern: /^[a-z_]+$/, message: '只允许小写字母和下划线' },
            ]}
          >
            <Input placeholder="请输入角色标识（如 admin）" disabled={!!editingRole} />
          </Form.Item>

          {/* 角色描述（非必填） */}
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>

          {/* 权限选择（核心修复：添加 valuePropName，对齐 UserListPage 的 Switch 写法） */}
          <Form.Item
            name="permissions"
            label="权限"
            valuePropName="value" // 明确绑定 Checkbox.Group 的 value 属性
          >
            <Checkbox.Group options={PERMISSIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}