import React, { useState } from 'react'
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
  InputNumber,
  Statistic,
  Tag,
  Dropdown,
  Menu,
  Slider,
  Tabs,
  Divider,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  EllipsisOutlined,
  BookOutlined,
  ApartmentOutlined,
  NumberOutlined,
  FieldTimeOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import styles from './index.module.scss'

const { Option } = Select
const { TabPane } = Tabs

// 课程数据接口
interface Course {
  id: number
  courseNumber: string
  courseName: string
  courseCategories: string
  courseProperties: string
  courseType: string
  courseNature: string
  englishName: string
  department: string
  enabledStatus: string
  creditHours: string
  theoreticalHours: string
  experimentalHours: string
  computerBasedHours: string | null
  practicalHours: string
  otherHours: string
  credits: string
  weeklyHours: string
  purelyPractical: string
  createTime: string
  teacher: string
  courseDescription: string
}

// 模拟数据
const mockCourses: Course[] = [
  {
    id: 1,
    courseNumber: '590101B0B06',
    courseName: '马克思主义基本原理',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'A类(纯理论课)',
    courseNature: '必修课',
    englishName: 'Basic Principles of Marxism',
    department: '马克思主义学院',
    enabledStatus: '是',
    creditHours: '72',
    theoreticalHours: '72',
    experimentalHours: '0',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '4',
    weeklyHours: '4',
    purelyPractical: '否',
    createTime: '2025-02-19',
    teacher: '王教授',
    courseDescription: '本课程主要内容包括马克思主义哲学、政治经济学和科学社会主义的基本原理。',
  },
  {
    id: 2,
    courseNumber: '590101B0B07',
    courseName: '高等数学A',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'B类(理论+实践)',
    courseNature: '必修课',
    englishName: 'Advanced Mathematics A',
    department: '理学院',
    enabledStatus: '是',
    creditHours: '64',
    theoreticalHours: '48',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3.5',
    weeklyHours: '3.5',
    purelyPractical: '否',
    createTime: '2025-02-20',
    teacher: '李教授',
    courseDescription: '本课程主要内容包括函数、极限、导数、积分、微分方程等数学基础知识及其应用。',
  },
  {
    id: 3,
    courseNumber: '590101B0B08',
    courseName: '大学物理',
    courseCategories: '专业核心课(必修)',
    courseProperties: '必修',
    courseType: 'B类(理论+实践)',
    courseNature: '必修课',
    englishName: 'College Physics',
    department: '理学院',
    enabledStatus: '是',
    creditHours: '56',
    theoreticalHours: '40',
    experimentalHours: '16',
    computerBasedHours: null,
    practicalHours: '0',
    otherHours: '0',
    credits: '3',
    weeklyHours: '3',
    purelyPractical: '否',
    createTime: '2025-02-21',
    teacher: '张教授',
    courseDescription: '力学、热学、电磁学、光学、近代物理基础。',
  },
]

// 统计数据
const statisticsData = {
  totalCourses: 10,
  professionalCoreCourses: 8,
  totalCredits: 35.0,
  totalTheoreticalHours: 448,
  monthlyIncrease: 8.2,
  professionalCoursesIncrease: 3.5,
  creditsIncrease: 5.7,
  theoreticalHoursIncrease: -1.2,
}

// 饼图数据（按时间范围）
const getDistributionData = (range: string) => {
  if (range === 'month') {
    return [
      { name: '专业核心课(必修)', value: 6 },
      { name: '专业选修课', value: 3 },
      { name: '公共课', value: 1 },
    ]
  } else if (range === 'quarter') {
    return [
      { name: '专业核心课(必修)', value: 18 },
      { name: '专业选修课', value: 8 },
      { name: '公共课', value: 4 },
    ]
  } else {
    return [
      { name: '专业核心课(必修)', value: 72 },
      { name: '专业选修课', value: 30 },
      { name: '公共课', value: 12 },
    ]
  }
}

const COLORS = ['#1890ff', '#ffc107', '#fa8c16']

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [courseCategory, setCourseCategory] = useState('')
  const [department, setDepartment] = useState('')
  const [courseType, setCourseType] = useState('')
  const [minCredits, setMinCredits] = useState<number>(0)
  const [maxCredits, setMaxCredits] = useState<number>(10)
  const [sortBy, setSortBy] = useState('courseNumber')
  const [timeRange, setTimeRange] = useState('month')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [form] = Form.useForm()

  // 搜索
  const handleSearch = () => {
    message.info('搜索功能已触发')
  }

  // 重置
  const handleReset = () => {
    setSearchTerm('')
    setCourseCategory('')
    setDepartment('')
    setCourseType('')
    setMinCredits(0)
    setMaxCredits(10)
    setSortBy('courseNumber')
  }

  // 新增课程
  const handleAddCourse = () => {
    setEditingCourse(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 编辑课程
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    form.setFieldsValue(course)
    setIsModalVisible(true)
  }

  // 删除课程
  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id))
    message.success('课程已删除')
  }

  // 查看课程
  const handleViewCourse = (course: Course) => {
    message.info(`查看课程: ${course.courseName}`)
  }

  // 导出/导入
  const handleExportData = () => message.info('导出数据')
  const handleImportData = () => message.info('导入数据')

  // 表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingCourse) {
        setCourses(courses.map(c => (c.id === editingCourse.id ? { ...c, ...values } : c)))
        message.success('课程已更新')
      } else {
        const newCourse: Course = {
          ...values,
          id: courses.length + 1,
          createTime: new Date().toISOString().split('T')[0],
        }
        setCourses([...courses, newCourse])
        message.success('课程已添加')
      }
      setIsModalVisible(false)
    })
  }

  // 操作菜单
  const renderActionMenu = (record: Course) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewCourse(record)}>
        查看
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditCourse(record)}>
        编辑
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDeleteCourse(record.id)}
      >
        删除
      </Menu.Item>
    </Menu>
  )

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (text: number) => <span style={{ fontWeight: 500, color: '#666' }}>{text}</span>,
    },
    {
      title: '课程编号/名称',
      key: 'courseInfo',
      width: 220,
      render: (_: any, record: Course) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            className={styles['course-name']}
            style={{
              fontWeight: 500,
              color: '#1890ff',
              fontSize: 15,
              transition: 'color 0.3s ease',
            }}
          >
            {record.courseName}
          </div>
          <div
            className={styles['course-code']}
            style={{
              fontSize: 12,
              color: '#999',
              fontFamily: 'monospace',
              letterSpacing: 0.5,
            }}
          >
            {record.courseNumber}
          </div>
        </div>
      ),
    },
    {
      title: '学院/分类',
      key: 'department',
      width: 190,
      render: (_: any, record: Course) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontWeight: 500, color: '#333' }}>{record.department}</div>
          <div
            className={styles['course-category']}
            style={{
              fontSize: 12,
              color: '#666',
              backgroundColor: '#f5f5f5',
              padding: '2px 8px',
              borderRadius: 10,
              alignSelf: 'flex-start',
            }}
          >
            {record.courseCategories}
          </div>
        </div>
      ),
    },
    {
      title: '学分',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      render: (text: string) => (
        <span
          style={{
            fontWeight: 500,
            color: '#fa8c16',
            fontSize: 14,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '理论/实验',
      key: 'hours',
      width: 150,
      render: (_: any, record: Course) => (
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ fontSize: 13, color: '#333' }}>理论: {record.theoreticalHours} 学时</div>
          <div style={{ fontSize: 13, color: '#1890ff' }}>
            实验: {record.experimentalHours} 学时
          </div>
        </div>
      ),
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      key: 'courseType',
      width: 140,
      render: (text: string) => (
        <span
          style={{
            fontSize: 13,
            color: '#666',
            backgroundColor: '#f0f9ff',
            padding: '4px 10px',
            borderRadius: 12,
            display: 'inline-block',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabledStatus',
      key: 'enabledStatus',
      width: 90,
      render: (text: string) => (
        <Tag
          color={text === '是' ? '#52c41a' : '#faad14'}
          style={{
            borderRadius: 12,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {text === '是' ? '已启用' : '未启用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: Course) => (
        <Dropdown overlay={renderActionMenu(record)} trigger={['click']} placement="bottomRight">
          <Button
            icon={<EllipsisOutlined />}
            size="small"
            style={{
              borderRadius: 20,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              border: '1px solid #e8e8e8',
              backgroundColor: '#fff',
            }}
            hoverStyle={{
              borderColor: '#1890ff',
              backgroundColor: '#f0f9ff',
              transform: 'scale(1.05)',
            }}
          />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className={styles['course-management']}>
      {/* 搜索筛选卡 */}
      <Card className={styles['search-card']} bordered={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
              <div className={styles['filter-item']}>
                <span className={styles['filter-label']}>学分范围</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Slider
                    range
                    min={0}
                    max={10}
                    step={0.5}
                    value={[minCredits, maxCredits]}
                    onChange={([min, max]) => {
                      setMinCredits(min)
                      setMaxCredits(max)
                    }}
                    style={{ width: 200 }}
                    tooltip={{
                      formatter: (value: number) => `${value} 学分`,
                      placement: 'top',
                    }}
                  />
                  <div
                    style={{
                      fontSize: 13,
                      color: '#666',
                      minWidth: 100,
                      textAlign: 'center',
                    }}
                  >
                    {minCredits} - {maxCredits} 学分
                  </div>
                </div>
              </div>
              <div className={styles['filter-item']}>
                <span className={styles['filter-label']}>排序方式</span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 160 }}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Option value="courseNumber">课程编号</Option>
                  <Option value="credits">学分</Option>
                  <Option value="theoreticalHours">理论学时</Option>
                </Select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{
                  borderRadius: 8,
                  padding: '6px 20px',
                  fontWeight: 500,
                }}
              >
                搜索
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                style={{
                  borderRadius: 8,
                  padding: '6px 20px',
                  fontWeight: 500,
                }}
              >
                重置
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles['stat-card']} bordered={false}>
            <div className={styles['stat-icon']} style={{ background: 'rgba(24,144,255,0.1)' }}>
              <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            </div>
            <Statistic
              title="总课程数"
              value={statisticsData.totalCourses}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
              suffix={
                <span
                  className={statisticsData.monthlyIncrease >= 0 ? 'trend-up' : 'trend-down'}
                  style={{ fontSize: 12, marginLeft: 4 }}
                >
                  {statisticsData.monthlyIncrease > 0 ? '+' : ''}
                  {statisticsData.monthlyIncrease}% 相比上月
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles['stat-card']} bordered={false}>
            <div className={styles['stat-icon']} style={{ background: 'rgba(250,173,20,0.1)' }}>
              <ApartmentOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
            </div>
            <Statistic
              title="专业核心课程"
              value={statisticsData.professionalCoreCourses}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
              suffix={
                <span
                  className={
                    statisticsData.professionalCoursesIncrease >= 0 ? 'trend-up' : 'trend-down'
                  }
                  style={{ fontSize: 12, marginLeft: 4 }}
                >
                  +{statisticsData.professionalCoursesIncrease}% 相比上月
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles['stat-card']} bordered={false}>
            <div className={styles['stat-icon']} style={{ background: 'rgba(82,196,26,0.1)' }}>
              <NumberOutlined style={{ fontSize: 32, color: '#52c41a' }} />
            </div>
            <Statistic
              title="总学分"
              value={statisticsData.totalCredits}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
              suffix={
                <span
                  className={statisticsData.creditsIncrease >= 0 ? 'trend-up' : 'trend-down'}
                  style={{ fontSize: 12, marginLeft: 4 }}
                >
                  +{statisticsData.creditsIncrease}% 相比上月
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles['stat-card']} bordered={false}>
            <div className={styles['stat-icon']} style={{ background: 'rgba(47,84,235,0.1)' }}>
              <FieldTimeOutlined style={{ fontSize: 32, color: '#2f54eb' }} />
            </div>
            <Statistic
              title="总理论学时"
              value={statisticsData.totalTheoreticalHours}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
              suffix={
                <span
                  className={
                    statisticsData.theoreticalHoursIncrease >= 0 ? 'trend-up' : 'trend-down'
                  }
                  style={{ fontSize: 12, marginLeft: 4 }}
                >
                  {statisticsData.theoreticalHoursIncrease}% 相比上月
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 课程列表与图表 */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={18}>
          <Card
            className={styles['course-list-card']}
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>课程列表</span>
                <span
                  style={{
                    fontSize: 13,
                    color: '#999',
                    backgroundColor: '#f5f5f5',
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}
                >
                  共 {courses.length} 门课程
                </span>
              </div>
            }
            extra={
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddCourse}
                  style={{
                    borderRadius: 8,
                    padding: '6px 18px',
                    fontWeight: 500,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    transition: 'all 0.3s ease',
                  }}
                  hoverStyle={{
                    backgroundColor: '#40a9ff',
                    borderColor: '#40a9ff',
                    transform: 'translateY(-1px)',
                  }}
                >
                  添加课程
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportData}
                  style={{
                    borderRadius: 8,
                    padding: '6px 16px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                  }}
                  hoverStyle={{
                    transform: 'translateY(-1px)',
                  }}
                >
                  导出数据
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={handleImportData}
                  style={{
                    borderRadius: 8,
                    padding: '6px 16px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                  }}
                  hoverStyle={{
                    transform: 'translateY(-1px)',
                  }}
                >
                  导入数据
                </Button>
              </div>
            }
          >
            <Table
              columns={columns}
              dataSource={courses}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: total => `共 ${total} 门课程`,
                showQuickJumper: true,
                style: {
                  marginTop: 20,
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 20,
                },
              }}
              className={styles['course-table']}
              rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
              loading={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card className={styles['chart-card']} bordered={false}>
            <div className={styles['chart-header']}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PieChartOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>课程分类分布</span>
              </div>
              <Tabs
                activeKey={timeRange}
                onChange={setTimeRange}
                size="small"
                style={{ minWidth: 150 }}
              >
                <TabPane tab="本月" key="month" />
                <TabPane tab="本季度" key="quarter" />
                <TabPane tab="本年度" key="year" />
              </Tabs>
            </div>
            <div className={styles['chart-container']}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getDistributionData(timeRange)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{
                      stroke: '#999',
                      strokeWidth: 1,
                      length: 10,
                      length2: 10,
                    }}
                  >
                    {getDistributionData(timeRange).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} 门`, name]}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #e8e8e8',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    formatter={value => (
                      <span style={{ fontSize: 12, color: '#666' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: '1px solid #f0f0f0',
                fontSize: 13,
                color: '#999',
                textAlign: 'center',
              }}
            >
              数据更新时间：{new Date().toLocaleString()}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 新增/编辑课程弹窗 */}
      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        className={styles['course-modal']}
      >
        <Form form={form} layout="vertical">
          <Card title="基本信息" size="small" className={styles['form-card']}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="courseNumber" label="课程编号" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="courseName" label="课程名称" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="courseCategories" label="课程分类" rules={[{ required: true }]}>
                  <Select placeholder="请选择">
                    <Option value="专业核心课(必修)">专业核心课(必修)</Option>
                    <Option value="专业选修课">专业选修课</Option>
                    <Option value="公共课">公共课</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="courseProperties" label="课程性质" rules={[{ required: true }]}>
                  <Select placeholder="请选择">
                    <Option value="必修">必修</Option>
                    <Option value="选修">选修</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="courseType" label="课程类型" rules={[{ required: true }]}>
                  <Select placeholder="请选择">
                    <Option value="A类(纯理论课)">A类(纯理论课)</Option>
                    <Option value="B类(理论+实践)">B类(理论+实践)</Option>
                    <Option value="C类(实践)">C类(实践)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="department" label="开课学院" rules={[{ required: true }]}>
                  <Select placeholder="请选择">
                    <Option value="理学院">理学院</Option>
                    <Option value="马克思主义学院">马克思主义学院</Option>
                    <Option value="信息学院">信息学院</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="teacher" label="任课教师" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="enabledStatus" label="启用状态" rules={[{ required: true }]}>
                  <Select placeholder="请选择">
                    <Option value="是">是</Option>
                    <Option value="否">否</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="学时信息" size="small" className={styles['form-card']}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="creditHours" label="总学时" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="theoreticalHours" label="理论学时" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="experimentalHours" label="实验学时" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="practicalHours" label="实践学时" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="computerBasedHours" label="上机学时">
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="otherHours" label="其他学时">
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="credits" label="学分" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} step={0.5} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="weeklyHours" label="周学时" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} step={0.5} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="purelyPractical" label="纯实践课程" rules={[{ required: true }]}>
                  <Select placeholder="请选择">
                    <Option value="是">是</Option>
                    <Option value="否">否</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="课程描述" size="small" className={styles['form-card']}>
            <Form.Item name="courseDescription">
              <Input.TextArea rows={3} placeholder="请输入课程描述" />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  )
}
