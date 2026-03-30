import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tabs,
  Table,
  Modal,
  Form,
  message,
  Spin,
} from 'antd'
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
} from 'recharts'
import dayjs from 'dayjs'
import styles from './classroomUsage.module.scss'
// 从redux中引入useScheduleData钩子
import { useSelector } from 'react-redux'

import { getClassroomsBase, getApplications, getUsers } from '../../api/classroom'
import { supabase } from '../../service/supabase'

const { Option } = Select
const { RangePicker } = DatePicker

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

interface Classroom {
  id: number
  classroom_name: string
  location: string
  type: number
  capacity: number
}

interface Application {
  id: number
  user_id: string
  classroom_id: number
  use_date: string
  start_time: string
  end_time: string
  purpose: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  classrooms: Classroom
  applicant: { name: string }
}

const ClassroomUsagePage: React.FC = () => {
  const userState = useSelector((state: any) => state.user)
  const currentUser = userState.userInfo // 直接拿到 userInfo 对象
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('today')
  const [dateRange, setDateRange] = useState<any>(null)
  const [location, setLocation] = useState('')
  const [classroomType, setClassroomType] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState('pending')
  const [searchKeyword, setSearchKeyword] = useState('')

  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [usageRecords, setUsageRecords] = useState<any[]>([])

  const [activeTab, setActiveTab] = useState('usage')
  const [applyModalVisible, setApplyModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // ================== 加载 & 拼接数据（无外键版） ==================
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const classData = await getClassroomsBase()
      const appData = await getApplications()
      const userData = await getUsers()

      const userMap: any = {}
      userData.forEach(u => {
        userMap[u.id] = u
      })

      const classMap: any = {}
      classData.forEach(c => {
        classMap[c.id] = c
      })

      const formattedApps = appData.map(app => ({
        ...app,
        applicant: userMap[app.user_id] || { name: '未知' },
        classrooms: classMap[app.classroom_id] || {},
      }))

      setClassrooms(classData || [])
      setApplications(formattedApps || [])
    } catch (err) {
      console.error(err)
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ================== 使用记录 ==================
  useEffect(() => {
    const list = applications
      .filter(a => a.status === 'approved')
      .map(a => ({
        id: a.id,
        classroomName: a.classrooms?.classroom_name,
        location: a.classrooms?.location,
        type: a.classrooms?.type,
        capacity: a.classrooms?.capacity,
        date: a.use_date,
        time: `${a.start_time} - ${a.end_time}`,
        courseName: a.purpose,
        teacher: a.applicant?.name || '未知',
        status: 'occupied',
      }))
    setUsageRecords(list)
  }, [applications])

  // ================== 筛选 ==================
  const filteredUsage = useMemo(() => {
    let list = [...usageRecords]
    const today = dayjs().format('YYYY-MM-DD')

    if (timeRange === 'custom' && dateRange?.length === 2) {
      const start = dateRange[0].format('YYYY-MM-DD')
      const end = dateRange[1].format('YYYY-MM-DD')
      list = list.filter(i => i.date >= start && i.date <= end)
    }
    if (location) list = list.filter(i => i.location === location)
    if (classroomType !== undefined) list = list.filter(i => i.type === classroomType)
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      list = list.filter(
        i =>
          i.classroomName?.toLowerCase().includes(kw) ||
          i.teacher?.toLowerCase().includes(kw) ||
          i.courseName?.toLowerCase().includes(kw)
      )
    }
    return list
  }, [usageRecords, timeRange, dateRange, location, classroomType, searchKeyword])

  const filteredApps = useMemo(() => {
    let list = [...applications]
    if (location) list = list.filter(a => a.classrooms?.location === location)
    if (classroomType !== undefined) list = list.filter(a => a.classrooms?.type === classroomType)
    if (status) list = list.filter(a => a.status == 'pending')
    console.log(list)

    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      list = list.filter(
        a =>
          a.classrooms?.classroom_name?.toLowerCase().includes(kw) ||
          a.applicant?.name?.toLowerCase().includes(kw) ||
          a.purpose?.toLowerCase().includes(kw)
      )
    }
    return list
  }, [applications, location, classroomType, status, searchKeyword])

  // ================== 统计 ==================
  const stats = useMemo(() => {
    const total = classrooms.length
    const occupied = usageRecords.length
    const free = Math.max(0, total - occupied)
    const usageRate = total ? Math.round((occupied / total) * 100) : 0
    const today = dayjs().format('YYYY-MM-DD')
    const todayApps = applications.filter(
      a => dayjs(a.created_at).format('YYYY-MM-DD') === today
    ).length
    const pending = applications.filter(a => a.status === 'pending').length
    return { total, occupied, free, usageRate, todayApps, pending }
  }, [classrooms, usageRecords, applications])

  // ================== 图表 ==================
  const chartTrend = useMemo(() => {
    return ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(h => ({
      time: h,
      usage: Math.floor(Math.random() * 40) + 40,
    }))
  }, [])

  const chartBuilding = useMemo(() => {
    const map: Record<string, number> = {}
    classrooms.forEach(c => {
      map[c.location] = (map[c.location] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [classrooms])

  const chartUsage = useMemo(() => {
    const total = applications.length
    const approved = applications.filter(a => a.status === 'approved').length
    const pending = applications.filter(a => a.status === 'pending').length
    return [
      { name: '已通过', value: approved },
      { name: '待审批', value: pending },
      { name: '其他', value: total - approved - pending },
    ]
  }, [applications])

  // ================== 提交申请 ==================
  const handleSubmitApply = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        user_id: currentUser.id,
        classroom_id: +values.classroom_id,
        use_date: values.use_date.format('YYYY-MM-DD'),
        start_time: values.start_time,
        end_time: values.end_time,
        purpose: values.purpose,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
      const { error } = await supabase.from('applications').insert([payload])
      if (error) throw error
      message.success('申请成功')
      setApplyModalVisible(false)
      form.resetFields()
      loadData()
    } catch (err) {
      message.error('提交失败')
    }
  }, [form, currentUser, loadData])

  // ================== 审批 ==================
  const handleApproval = useCallback(
    async (id: number, pass: boolean) => {
      try {
        const { error } = await supabase
          .from('applications')
          .update({
            status: pass ? 'approved' : 'rejected',
            approver_id: currentUser.id && currentUser.id.length > 10 ? currentUser.id : null,
            approval_time: new Date().toISOString(),
          })
          .eq('id', id)
        if (error) throw error
        message.success(pass ? '已通过' : '已驳回')
        loadData()
      } catch {
        message.error('操作失败')
      }
    },
    [currentUser, loadData]
  )

  // ================== 表格列 ==================
  const usageColumns = [
    { title: '教室', dataIndex: 'classroomName', width: 130 },
    {
      title: '信息',
      width: 200,
      render: (_, r) => {
        const typeMap: Record<number, string> = {
          1: '普通教室',
          2: '实训车间',
          3: '实验室',
          4: '机房',
          5: '艺术教室',
          6: '会议室',
        }
        return (
          <>
            {r.location}
            &nbsp;
            {typeMap[r.type] || '未知'}
            &nbsp;
            {r.capacity}人
          </>
        )
      },
    },
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '时间段', dataIndex: 'time', width: 160 },
    { title: '用途', dataIndex: 'courseName', width: 180 },
    { title: '使用人', dataIndex: 'teacher', width: 120 },
    {
      title: '状态',
      width: 100,
      render: () => <span className={styles.occupiedTag}>已占用</span>,
    },
    {
      title: '操作',
      width: 100,
      render: (_, r) => (
        <Button
          style={{ marginTop: '-40px' }}
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(r)
            setDetailModalVisible(true)
          }}
        >
          查看
        </Button>
      ),
    },
  ]

  const appColumns = [
    // { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '申请人', render: (_, r) => r.applicant?.name || '未知', width: 120 },
    {
      title: '教室',
      render: (_, r) => {
        const typeMap: Record<number, string> = {
          1: '普通',
          2: '实训',
          3: '实验',
          4: '机房',
          5: '艺术',
          6: '会议',
        }
        return `${r.classrooms?.classroom_name}（${typeMap[r.classrooms?.type] || '未知'}）`
      },
      width: 180,
    },
    {
      title: '时间',
      render: (_, r) => (
        <>
          {r.use_date}
          <br />
          {r.start_time} - {r.end_time}
        </>
      ),
      width: 180,
    },
    { title: '用途', dataIndex: 'purpose', width: 140 },
    {
      title: '状态',
      width: 100,
      render: (_, r) => {
        if (r.status === 'pending') return <span className={styles.statusPending}>待审批</span>
        if (r.status === 'approved') return <span className={styles.statusApproved}>已通过</span>
        if (r.status === 'rejected') return <span className={styles.statusRejected}>已驳回</span>
        return <span>未知</span>
      },
    },
    {
      title: '操作',
      width: currentUser.role === 'admin' ? 180 : 120,
      render: (_, r) => (
        <Space.Compact
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '-40px',
          }}
        >
          {currentUser.role === 'admin' && r.status === 'pending' && (
            <>
              <Button size="small" onClick={() => handleApproval(r.id, true)}>
                通过
              </Button>
              <Button size="small" onClick={() => handleApproval(r.id, false)}>
                驳回
              </Button>
            </>
          )}
          <Button
            size="small"
            onClick={() => {
              setSelectedRecord(r)
              setDetailModalVisible(true)
            }}
          >
            查看
          </Button>
        </Space.Compact>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'usage',
      label: '教室使用记录',
      children: (
        <Table
          columns={usageColumns}
          dataSource={filteredUsage}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'application',
      label: '教室申请管理',
      children: (
        <Table
          columns={appColumns}
          dataSource={filteredApps}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ]

  // 类型选项
  const typeOptions = [
    { label: '普通教室', value: 1 },
    { label: '实训车间', value: 2 },
    { label: '实验室', value: 3 },
    { label: '机房', value: 4 },
    { label: '艺术教室', value: 5 },
    { label: '会议室', value: 6 },
  ]

  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        <Card className={styles.headerCard} variant="borderless">
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>教室使用统计与申请管理</h1>
            <Space>
              {currentUser.role === 'admin' && <Button icon={<ExportOutlined />}>导出报表</Button>}
              {currentUser.role !== 'admin' && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setApplyModalVisible(true)}
                >
                  申请教室
                </Button>
              )}
              <Button icon={<ReloadOutlined />} onClick={loadData}>
                刷新
              </Button>
            </Space>
          </div>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={8}>
              <Space>
                <Button
                  type={timeRange === 'today' ? 'primary' : 'default'}
                  onClick={() => setTimeRange('today')}
                >
                  今日
                </Button>
                <Button
                  type={timeRange === 'week' ? 'primary' : 'default'}
                  onClick={() => setTimeRange('week')}
                >
                  本周
                </Button>
                <Button
                  type={timeRange === 'month' ? 'primary' : 'default'}
                  onClick={() => setTimeRange('month')}
                >
                  本月
                </Button>
                <Button
                  type={timeRange === 'custom' ? 'primary' : 'default'}
                  onClick={() => setTimeRange('custom')}
                >
                  自定义
                </Button>
                {timeRange === 'custom' && (
                  <RangePicker onChange={setDateRange} value={dateRange} />
                )}
              </Space>
            </Col>
            <Col xs={24} md={16}>
              <Space wrap>
                <Select
                  placeholder="楼栋"
                  allowClear
                  style={{ width: 130 }}
                  value={location}
                  onChange={setLocation}
                >
                  {[...new Set(classrooms.map(c => c.location))].map(b => (
                    <Option key={b} value={b}>
                      {b}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="教室类型"
                  allowClear
                  style={{ width: 130 }}
                  value={classroomType}
                  onChange={setClassroomType}
                >
                  {typeOptions.map(t => (
                    <Option key={t.value} value={t.value}>
                      {t.label}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="状态"
                  allowClear
                  style={{ width: 120 }}
                  value={status}
                  onChange={setStatus}
                >
                  <Option value="pending">待审批</Option>
                  <Option value="approved">已通过</Option>
                  <Option value="rejected">已驳回</Option>
                </Select>

                <Input
                  placeholder="搜索"
                  style={{ width: 200 }}
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  suffix={<SearchOutlined />}
                />
                <Button type="primary">查询</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={4}>
            <StatCard label="教室总数" value={stats.total} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <StatCard label="已占用" value={stats.occupied} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <StatCard label="空闲" value={stats.free} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <StatCard label="今日申请" value={stats.todayApps} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <StatCard label="待审批" value={stats.pending} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <StatCard label="使用率" value={`${stats.usageRate}%`} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title="时段使用率" variant="borderless" className={styles.chartCard}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <ReTooltip />
                  <Line type="monotone" dataKey="usage" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card title="楼栋分布" variant="borderless" className={styles.chartCard}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={chartBuilding} outerRadius={70} dataKey="value" label={d => d.name}>
                    {chartBuilding.map((_, i) => (
                      <Cell fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card title="申请状态" variant="borderless" className={styles.chartCard}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={chartUsage} outerRadius={70} dataKey="value" label={d => d.name}>
                    {chartUsage.map((_, i) => (
                      <Cell fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Card variant="borderless">
          <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
        </Card>
        <Modal
          title="详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={<Button onClick={() => setDetailModalVisible(false)}>关闭</Button>}
          width={600}
        >
          {selectedRecord && (
            <div style={{ lineHeight: 2.2 }}>
              {activeTab === 'usage' ? (
                <>
                  <p>教室：{selectedRecord.classroomName}</p>
                  <p>位置：{selectedRecord.location}</p>
                  <p>
                    类型：
                    {(() => {
                      const m = { 1: '普通', 2: '实训', 3: '实验', 4: '机房', 5: '艺术', 6: '会议' }
                      return m[selectedRecord.type] || '未知'
                    })()}
                  </p>
                  <p>日期：{selectedRecord.date}</p>
                  <p>时间：{selectedRecord.time}</p>
                  <p>用途：{selectedRecord.courseName}</p>
                  <p>使用人：{selectedRecord.teacher}</p>
                </>
              ) : (
                <>
                  <p>ID：{selectedRecord.id}</p>
                  <p>申请人：{selectedRecord.applicant?.name}</p>
                  <p>教室：{selectedRecord.classrooms?.classroom_name}</p>
                  <p>日期：{selectedRecord.use_date}</p>
                  <p>
                    时间：{selectedRecord.start_time} - {selectedRecord.end_time}
                  </p>
                  <p>用途：{selectedRecord.purpose}</p>
                  <p>
                    状态：
                    {selectedRecord.status === 'pending'
                      ? '待审批'
                      : selectedRecord.status === 'approved'
                        ? '已通过'
                        : '已驳回'}
                  </p>
                </>
              )}
            </div>
          )}
        </Modal>
      </Spin>
    </div>
  )
}

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Card className={styles.statCard} variant="borderless">
    <div style={{ fontSize: 14, color: '#666' }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>{value}</div>
  </Card>
)

export default ClassroomUsagePage
