import React, { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col, Button, Space, Input, Select, DatePicker, Tabs, Table, Modal, Form, message, notification, Spin } from 'antd'
import { SearchOutlined, ExportOutlined, PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import styles from './classroomUsage.module.scss'
import { useScheduleData } from '../../hooks/useScheduleData'

const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

// 模拟教室数据
const mockClassrooms = [
  { id: 'A101', building: '教学楼A', type: '普通教室', capacity: 45, status: 'occupied' },
  { id: 'A102', building: '教学楼A', type: '多媒体教室', capacity: 60, status: 'free' },
  { id: 'B201', building: '教学楼B', type: '普通教室', capacity: 45, status: 'occupied' },
  { id: 'B202', building: '教学楼B', type: '多媒体教室', capacity: 80, status: 'free' },
  { id: 'C301', building: '教学楼C', type: '机房', capacity: 40, status: 'occupied' },
  { id: 'C302', building: '教学楼C', type: '实验室', capacity: 30, status: 'free' },
  { id: 'E101', building: '实验楼', type: '实验室', capacity: 25, status: 'occupied' },
  { id: 'F101', building: '综合楼', type: '活动室', capacity: 100, status: 'free' },
]

// 模拟使用记录数据
const mockUsageRecords = [
  { id: '1', classroomId: 'A101', classroomName: 'A101', building: '教学楼A', type: '普通教室', capacity: 45, date: '2026-03-20', time: '08:00-09:40', courseName: '高等数学', teacher: '王老师', status: 'occupied' },
  { id: '2', classroomId: 'B201', classroomName: 'B201', building: '教学楼B', type: '普通教室', capacity: 45, date: '2026-03-20', time: '10:00-11:40', courseName: '大学英语', teacher: '李老师', status: 'occupied' },
  { id: '3', classroomId: 'C301', classroomName: 'C301', building: '教学楼C', type: '机房', capacity: 40, date: '2026-03-20', time: '14:00-15:40', courseName: '程序设计', teacher: '张老师', status: 'occupied' },
  { id: '4', classroomId: 'E101', classroomName: 'E101', building: '实验楼', type: '实验室', capacity: 25, date: '2026-03-20', time: '16:00-17:40', courseName: '物理实验', teacher: '刘老师', status: 'occupied' },
]

// 模拟申请记录数据
const mockApplicationRecords = [
  { id: '1', applicant: '张三', role: '学生', classroomId: 'A102', classroomName: 'A102', building: '教学楼A', type: '多媒体教室', capacity: 60, useDate: '2026-03-21', startTime: '14:00', endTime: '16:00', purpose: '社团活动', applyTime: '2026-03-19', status: 'pending', approver: null, approvalTime: null, approvalComment: null },
  { id: '2', applicant: '李四', role: '教师', classroomId: 'B202', classroomName: 'B202', building: '教学楼B', type: '多媒体教室', capacity: 80, useDate: '2026-03-22', startTime: '10:00', endTime: '12:00', purpose: '补课', applyTime: '2026-03-18', status: 'approved', approver: '管理员', approvalTime: '2026-03-19', approvalComment: '同意使用' },
  { id: '3', applicant: '王五', role: '学生', classroomId: 'F101', classroomName: 'F101', building: '综合楼', type: '活动室', capacity: 100, useDate: '2026-03-23', startTime: '18:00', endTime: '20:00', purpose: '竞赛准备', applyTime: '2026-03-17', status: 'rejected', approver: '管理员', approvalTime: '2026-03-18', approvalComment: '该时间段已被占用' },
]

// 模拟图表数据
const mockUsageTrendData = [
  { time: '08:00', usage: 30 },
  { time: '09:00', usage: 60 },
  { time: '10:00', usage: 80 },
  { time: '11:00', usage: 75 },
  { time: '14:00', usage: 65 },
  { time: '15:00', usage: 90 },
  { time: '16:00', usage: 85 },
  { time: '17:00', usage: 40 },
]

const mockBuildingDistributionData = [
  { name: '教学楼A', value: 15, occupied: 8 },
  { name: '教学楼B', value: 12, occupied: 7 },
  { name: '教学楼C', value: 10, occupied: 6 },
  { name: '实验楼', value: 8, occupied: 5 },
  { name: '综合楼', value: 5, occupied: 2 },
]

const mockUsageTypeData = [
  { name: '系统排课', value: 60 },
  { name: '临时申请', value: 25 },
  { name: '闲置', value: 15 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const ClassroomUsagePage: React.FC = () => {
  const { currentUser } = useScheduleData()
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('today')
  const [dateRange, setDateRange] = useState<any>(null)
  const [building, setBuilding] = useState('')
  const [classroomType, setClassroomType] = useState('')
  const [capacity, setCapacity] = useState('')
  const [status, setStatus] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [activeTabKey, setActiveTabKey] = useState('usage')
  const [applicationModalVisible, setApplicationModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [form] = Form.useForm()
  
  // 计算统计数据
  const statistics = {
    totalClassrooms: mockClassrooms.length,
    occupiedClassrooms: mockClassrooms.filter(c => c.status === 'occupied').length,
    freeClassrooms: mockClassrooms.filter(c => c.status === 'free').length,
    usageRate: Math.round((mockClassrooms.filter(c => c.status === 'occupied').length / mockClassrooms.length) * 100),
    todayApplications: 3,
    pendingApplications: 1,
    approvalRate: 66,
  }



  // 处理搜索
  const handleSearch = useCallback(() => {
    // 搜索逻辑
    console.log('搜索', { searchKeyword, building, classroomType, capacity, status })
    // 这里可以添加模拟的搜索逻辑
  }, [searchKeyword, building, classroomType, capacity, status])

  // 处理申请提交
  const handleApplicationSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields()
      // 提交申请逻辑
      console.log('提交申请', values)
      message.success('申请提交成功')
      setApplicationModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败', error)
    }
  }, [form])

  // 处理审批
  const handleApproval = useCallback((id: string, approved: boolean, comment?: string) => {
    // 审批逻辑
    console.log('审批', { id, approved, comment })
    message.success(approved ? '审批通过' : '审批驳回')
  }, [])

  // 处理查看详情
  const handleViewDetail = useCallback((record: any) => {
    setSelectedRecord(record)
    setDetailModalVisible(true)
  }, [])

  // 渲染使用记录表格列
  const usageColumns = [
    {
      title: '教室编号',
      dataIndex: 'classroomName',
      key: 'classroomName',
      width: 100,
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>{text}</span>
      ),
    },
    {
      title: '楼栋 + 类型 + 容量',
      key: 'info',
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div>{record.building}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.type} ({record.capacity}人)</div>
        </div>
      ),
    },
    {
      title: '使用日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '节次 / 时间段',
      dataIndex: 'time',
      key: 'time',
      width: 150,
    },
    {
      title: '课程名称 / 使用用途',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 180,
    },
    {
      title: '任课教师 / 使用人',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 150,
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => (
        <span className={text === 'occupied' ? styles.occupiedTag : styles.freeTag}>
          {text === 'occupied' ? '已占用' : '已结束'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>
      ),
    },
  ]

  // 渲染申请记录表格列
  const applicationColumns = [
    {
      title: '申请 ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '申请人',
      key: 'applicant',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div>{record.applicant}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.role}</div>
        </div>
      ),
    },
    {
      title: '申请教室',
      key: 'classroom',
      width: 180,
      render: (_: any, record: any) => (
        <div>
          <div>{record.classroomName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.type} ({record.capacity}人)</div>
        </div>
      ),
    },
    {
      title: '申请使用时间',
      key: 'useTime',
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div>{record.useDate}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.startTime} - {record.endTime}</div>
        </div>
      ),
    },
    {
      title: '使用用途',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 120,
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 120,
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text: string) => {
        let color = ''
        let label = ''
        switch (text) {
          case 'pending':
            color = '#faad14'
            label = '待审批'
            break
          case 'approved':
            color = '#52c41a'
            label = '已通过'
            break
          case 'rejected':
            color = '#f5222d'
            label = '已驳回'
            break
          case 'used':
            color = '#1890ff'
            label = '已使用'
            break
          case 'expired':
            color = '#999'
            label = '已过期'
            break
          default:
            color = '#999'
            label = '未知'
        }
        return (
          <span style={{ color, fontWeight: 500 }}>{label}</span>
        )
      },
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => {
        if (currentUser.role === 'admin') {
          return (
            <Space size="small">
              {record.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    size="small"
                    onClick={() => handleApproval(record.id, true)}
                  >
                    通过
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => handleApproval(record.id, false)}
                  >
                    驳回
                  </Button>
                </>
              )}
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewDetail(record)}
              >
                查看
              </Button>
            </Space>
          )
        } else {
          return (
            <Space size="small">
              {record.status === 'pending' && (
                <Button size="small">撤销</Button>
              )}
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewDetail(record)}
              >
                查看
              </Button>
            </Space>
          )
        }
      },
    },
  ]

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <Card className={styles.headerCard} bordered={false}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>教室使用统计 & 申请管理</h1>
          <Space>
            {currentUser.role === 'admin' && (
              <Button type="default" icon={<ExportOutlined />}>
                导出报表
              </Button>
            )}
            {currentUser.role !== 'admin' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setApplicationModalVisible(true)}>
                申请教室
              </Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
              刷新
            </Button>
          </Space>
        </div>

        {/* 筛选区 */}
        <div className={styles.filterSection}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>时间范围</span>
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
                </Space>
                {timeRange === 'custom' && (
                  <RangePicker 
                    style={{ marginLeft: 12 }} 
                    value={dateRange}
                    onChange={setDateRange}
                  />
                )}
              </div>
            </Col>
            <Col xs={24} sm={12} md={16}>
              <div className={styles.filterRow}>
                <Select
                  placeholder="选择楼栋"
                  style={{ width: 120, marginRight: 12 }}
                  value={building}
                  onChange={setBuilding}
                  allowClear
                >
                  <Option value="教学楼A">教学楼A</Option>
                  <Option value="教学楼B">教学楼B</Option>
                  <Option value="教学楼C">教学楼C</Option>
                  <Option value="实验楼">实验楼</Option>
                  <Option value="综合楼">综合楼</Option>
                </Select>
                <Select
                  placeholder="教室类型"
                  style={{ width: 120, marginRight: 12 }}
                  value={classroomType}
                  onChange={setClassroomType}
                  allowClear
                >
                  <Option value="普通教室">普通教室</Option>
                  <Option value="多媒体教室">多媒体教室</Option>
                  <Option value="机房">机房</Option>
                  <Option value="实验室">实验室</Option>
                  <Option value="活动室">活动室</Option>
                </Select>
                <Select
                  placeholder="容量"
                  style={{ width: 100, marginRight: 12 }}
                  value={capacity}
                  onChange={setCapacity}
                  allowClear
                >
                  <Option value="small">小 (&lt;50人)</Option>
                  <Option value="medium">中 (50-100人)</Option>
                  <Option value="large">大 (&gt;100人)</Option>
                </Select>
                <Select
                  placeholder="使用状态"
                  style={{ width: 120, marginRight: 12 }}
                  value={status}
                  onChange={setStatus}
                  allowClear
                >
                  <Option value="occupied">已占用</Option>
                  <Option value="free">空闲</Option>
                  <Option value="pending">待审批</Option>
                  <Option value="rejected">已驳回</Option>
                </Select>
                <Input
                  placeholder="搜索教室号、教师姓名"
                  style={{ width: 200, marginRight: 12 }}
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  suffix={<SearchOutlined />}
                  onPressEnter={handleSearch}
                />
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 数据概览卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} >
        <Col xs={24} sm={12} md={3}   >
          <Card className={styles.statCard} bordered={false} >
            <div className={styles.statIcon} style={{ background: 'rgba(24,144,255,0.1)' }}>
              <span className={styles.statIconText}>总</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>教室总数</h3>
                <h3 className={styles.statValue}>{statistics.totalClassrooms}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statIcon} style={{ background: 'rgba(255,77,77,0.1)' }}>
              <span className={styles.statIconText}>占</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>当前占用数</h3>
                <h3 className={styles.statValue}>{statistics.occupiedClassrooms}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statIcon} style={{ background: 'rgba(82,196,26,0.1)' }}>
              <span className={styles.statIconText}>空</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>当前空闲数</h3>
                <h3 className={styles.statValue}>{statistics.freeClassrooms}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statIcon} style={{ background: 'rgba(138,43,226,0.1)' }}>
              <span className={styles.statIconText}>申</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>今日申请</h3>
                <h3 className={styles.statValue}>{statistics.todayApplications}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={3}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statIcon} style={{ background: 'rgba(0,191,255,0.1)' }}>
              <span className={styles.statIconText}>待</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>待审批数</h3>
                <h3 className={styles.statValue}>{statistics.pendingApplications}</h3>
              </div>
            </div>
          </Card>
        </Col>
              <Col xs={24} sm={12} md={4}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statIcon} style={{ background: 'rgba(250,173,20,0.1)' }}>
              <span className={styles.statIconText}>率</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>教室使用率</h3>
                <h3 className={styles.statValue}>{statistics.usageRate}%</h3>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ 
                    width: `${statistics.usageRate}%`,
                    backgroundColor: statistics.usageRate < 60 ? '#52c41a' : statistics.usageRate < 80 ? '#faad14' : '#f5222d'
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={5}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statIcon} style={{ background: 'rgba(30,144,255,0.1)' }}>
              <span className={styles.statIconText}>通</span>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <h3 className={styles.statTitle}>审批通过率</h3>
                <h3 className={styles.statValue}>{statistics.approvalRate}%</h3>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ 
                    width: `${statistics.approvalRate}%`,
                    backgroundColor: '#52c41a'
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 可视化图表区 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card className={styles.chartCard} bordered={false} title="教室使用率趋势图">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockUsageTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, '使用率']} />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="#1890ff" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className={styles.chartCard} bordered={false} title="楼栋教室分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockBuildingDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockBuildingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}间`, '教室数']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className={styles.chartCard} bordered={false} title="使用类型分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockUsageTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {mockUsageTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '占比']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 教室使用状态列表 */}
      <Card className={styles.tableCard} bordered={false}>
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="教室使用记录" key="usage">
            <Table
              columns={usageColumns}
              dataSource={mockUsageRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              className={styles.table}
            />
          </TabPane>
          <TabPane tab="教室申请记录" key="application">
            <Table
              columns={applicationColumns}
              dataSource={mockApplicationRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              className={styles.table}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 教室申请弹窗 */}
      <Modal
        title="申请教室"
        open={applicationModalVisible}
        onCancel={() => setApplicationModalVisible(false)}
        onOk={handleApplicationSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="classroom" label="选择教室" rules={[{ required: true, message: '请选择教室' }]}>
            <Select placeholder="请选择教室">
              {mockClassrooms.filter(c => c.status === 'free').map(classroom => (
                <Option key={classroom.id} value={classroom.id}>
                  {classroom.id} - {classroom.building} - {classroom.type} ({classroom.capacity}人)
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="useDate" label="使用日期" rules={[{ required: true, message: '请选择使用日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <Select placeholder="请选择开始时间">
                  {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(time => (
                    <Option key={time} value={time}>{time}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <Select placeholder="请选择结束时间">
                  {['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(time => (
                    <Option key={time} value={time}>{time}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="purpose" label="使用用途" rules={[{ required: true, message: '请选择使用用途' }]}>
            <Select placeholder="请选择使用用途">
              <Option value="补课">补课</Option>
              <Option value="社团">社团活动</Option>
              <Option value="自习">自习</Option>
              <Option value="竞赛">竞赛</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="useCount" label="使用人数" rules={[{ required: true, message: '请输入使用人数' }]}>
            <Input type="number" placeholder="请输入使用人数" />
          </Form.Item>
          <Form.Item name="description" label="用途说明" rules={[{ required: true, message: '请输入用途说明' }]}>
            <Input.TextArea rows={3} placeholder="请详细说明使用用途" />
          </Form.Item>
          <Form.Item name="contact" label="联系方式" rules={[{ required: true, message: '请输入联系方式' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="equipment" label="设备需求">
            <Select mode="multiple" placeholder="请选择设备需求">
              <Option value="投影">投影</Option>
              <Option value="空调">空调</Option>
              <Option value="麦克风">麦克风</Option>
              <Option value="音响">音响</Option>
              <Option value="白板">白板</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title={selectedRecord ? (activeTabKey === 'usage' ? '教室使用详情' : '申请详情') : '详情'}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedRecord && (
          <div className={styles.detailContent}>
            {activeTabKey === 'usage' ? (
              <>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>教室编号：</span>
                  <span className={styles.detailValue}>{selectedRecord.classroomName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>楼栋：</span>
                  <span className={styles.detailValue}>{selectedRecord.building}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>类型：</span>
                  <span className={styles.detailValue}>{selectedRecord.type}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>容量：</span>
                  <span className={styles.detailValue}>{selectedRecord.capacity}人</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>使用日期：</span>
                  <span className={styles.detailValue}>{selectedRecord.date}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>时间段：</span>
                  <span className={styles.detailValue}>{selectedRecord.time}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>课程名称：</span>
                  <span className={styles.detailValue}>{selectedRecord.courseName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>任课教师：</span>
                  <span className={styles.detailValue}>{selectedRecord.teacher}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>使用状态：</span>
                  <span className={selectedRecord.status === 'occupied' ? styles.occupiedTag : styles.freeTag}>
                    {selectedRecord.status === 'occupied' ? '已占用' : '已结束'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>申请 ID：</span>
                  <span className={styles.detailValue}>{selectedRecord.id}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>申请人：</span>
                  <span className={styles.detailValue}>{selectedRecord.applicant} ({selectedRecord.role})</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>申请教室：</span>
                  <span className={styles.detailValue}>{selectedRecord.classroomName} ({selectedRecord.type}, {selectedRecord.capacity}人)</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>使用日期：</span>
                  <span className={styles.detailValue}>{selectedRecord.useDate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>使用时间段：</span>
                  <span className={styles.detailValue}>{selectedRecord.startTime} - {selectedRecord.endTime}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>使用用途：</span>
                  <span className={styles.detailValue}>{selectedRecord.purpose}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>申请时间：</span>
                  <span className={styles.detailValue}>{selectedRecord.applyTime}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>审批状态：</span>
                  <span style={{ 
                    color: selectedRecord.status === 'pending' ? '#faad14' : 
                           selectedRecord.status === 'approved' ? '#52c41a' : 
                           selectedRecord.status === 'rejected' ? '#f5222d' : 
                           selectedRecord.status === 'used' ? '#1890ff' : '#999',
                    fontWeight: 500
                  }}>
                    {selectedRecord.status === 'pending' ? '待审批' : 
                     selectedRecord.status === 'approved' ? '已通过' : 
                     selectedRecord.status === 'rejected' ? '已驳回' : 
                     selectedRecord.status === 'used' ? '已使用' : '已过期'}
                  </span>
                </div>
                {selectedRecord.approver && (
                  <>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>审批人：</span>
                      <span className={styles.detailValue}>{selectedRecord.approver}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>审批时间：</span>
                      <span className={styles.detailValue}>{selectedRecord.approvalTime}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>审批意见：</span>
                      <span className={styles.detailValue}>{selectedRecord.approvalComment}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ClassroomUsagePage