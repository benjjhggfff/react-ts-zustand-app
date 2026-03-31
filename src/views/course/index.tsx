import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Table,
  message,
  Modal,
  Form,
  Statistic,
  Tag,
  Slider,
  Tabs,
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
  BookOutlined,
  ApartmentOutlined,
  NumberOutlined,
  FieldTimeOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import styles from './index.module.scss'

import { getCourses, addCourse, updateCourse, deleteCourse, type Course } from '../../api/course'

const { Option } = Select
const { TabPane } = Tabs
const COLORS = ['#1890ff', '#ffc107', '#fa8c16']

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [courseCategory, setCourseCategory] = useState('')
  const [department, setDepartment] = useState('')
  const [courseType, setCourseType] = useState('')
  const [minCredits, setMinCredits] = useState<number>(0)
  const [maxCredits, setMaxCredits] = useState<number>(10)
  const [sortBy, setSortBy] = useState('coursenumber')
  const [timeRange, setTimeRange] = useState('month')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [form] = Form.useForm()

  // 加载数据
  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (err: any) {
      message.error('加载失败：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  // 新增
  const handleAddCourse = () => {
    setEditingCourse(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 编辑
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    form.setFieldsValue(course)
    setIsModalVisible(true)
  }

  // 删除
  const handleDeleteCourse = async (id: number) => {
    try {
      await deleteCourse(id)
      message.success('删除成功')
      fetchData()
    } catch (err: any) {
      message.error('删除失败')
    }
  }

  // 查看
  const handleViewCourse = (course: Course) => {
    message.info(`查看课程: ${course.coursename}`)
  }

  // 导出导入
  const handleExportData = () => message.info('导出数据')
  const handleImportData = () => message.info('导入数据')

  // 提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const courseData = {
        ...values,
        createTime: editingCourse ? undefined : new Date().toISOString().split('T')[0],
      }

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData)
        message.success('课程已更新')
      } else {
        await addCourse(courseData)
        message.success('课程已添加')
      }

      setIsModalVisible(false)
      fetchData()
    } catch (err) {
      message.error('提交失败')
    }
  }

  // 统计
  const statisticsData = {
    totalCourses: courses.length,
    professionalCoreCourses: courses.filter(i => i.coursecategories === '专业核心课(必修)').length,
    totalCredits: courses.reduce((sum, i) => sum + Number(i.credits || 0), 0),
    totalTheoreticalHours: courses.reduce((sum, i) => sum + Number(i.theoreticalhours || 0), 0),
  }

  // 饼图
  const getDistributionData = () => {
    const countMap: Record<string, number> = {
      '专业核心课(必修)': 0,
      专业选修课: 0,
      公共课: 0,
    }
    courses.forEach(i => {
      if (countMap[i.coursecategories] !== undefined) {
        countMap[i.coursecategories]++
      }
    })
    return [
      { name: '专业核心课(必修)', value: countMap['专业核心课(必修)'] },
      { name: '专业选修课', value: countMap['专业选修课'] },
      { name: '公共课', value: countMap['公共课'] },
    ]
  }

  // 表格列
  const columns = [
    {
      title: '课程编号/名称',
      key: 'courseInfo',
      width: 220,
      render: (_: any, record: Course) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            className={styles['course-name']}
            style={{ fontWeight: 500, color: '#1890ff', fontSize: 15 }}
          >
            {record.coursename}
          </div>
          <div
            className={styles['course-code']}
            style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}
          >
            {record.coursenumber}
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
            style={{
              fontSize: 12,
              color: '#666',
              backgroundColor: '#f5f5f5',
              padding: '2px 8px',
              borderRadius: 10,
              alignSelf: 'flex-start',
            }}
          >
            {record.coursecategories}
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
        <span style={{ fontWeight: 500, color: '#fa8c16', fontSize: 14 }}>{text}</span>
      ),
    },
    {
      title: '理论/实验',
      key: 'hours',
      width: 150,
      render: (_: any, record: Course) => (
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ fontSize: 13, color: '#333' }}>理论: {record.theoreticalhours}</div> &nbsp;
          <div style={{ fontSize: 13, color: '#1890ff' }}>实验: {record.experimentalhours}</div>
        </div>
      ),
    },
    {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      render: (_: any, record: Course) => (
        <span
          style={{
            fontSize: 13,
            color: '#666',
            // backgroundColor: '#f0f9ff',
            padding: '4px 10px',
            borderRadius: 12,
          }}
        >
          {record.coursetype} &nbsp;({record.coursenature})
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabledstatus',
      key: 'enabledstatus',
      width: 90,
      render: (text: string) => (
        <Tag
          color={text === '是' ? '#52c41a' : '#faad14'}
          style={{ borderRadius: 12, padding: '4px 12px', fontSize: 12 }}
        >
          {text === '是' ? '已启用' : '未启用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Course) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            style={{ color: '#606061' }}
            onClick={() => handleViewCourse(record)}
          >
            查看
          </Button>
          <Button
            size="small"
            style={{ color: '#606061' }}
            onClick={() => handleEditCourse(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            style={{ color: '#606061' }}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除课程 "${record.coursename}" 吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => handleDeleteCourse(record.id),
              })
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className={styles['course-management']}>
      {/* 搜索筛选 */}

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <div
              style={{
                background: 'rgba(24,144,255,0.1)',
                display: 'inline-block',
                padding: 8,
                borderRadius: 8,
              }}
            >
              <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            </div>
            <Statistic
              title="总课程数"
              value={statisticsData.totalCourses}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <div
              style={{
                background: 'rgba(250,173,20,0.1)',
                display: 'inline-block',
                padding: 8,
                borderRadius: 8,
              }}
            >
              <ApartmentOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
            </div>
            <Statistic
              title="专业核心课程"
              value={statisticsData.professionalCoreCourses}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <div
              style={{
                background: 'rgba(82,196,26,0.1)',
                display: 'inline-block',
                padding: 8,
                borderRadius: 8,
              }}
            >
              <NumberOutlined style={{ fontSize: 32, color: '#52c41a' }} />
            </div>
            <Statistic
              title="总学分"
              value={statisticsData.totalCredits}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <div
              style={{
                background: 'rgba(47,84,235,0.1)',
                display: 'inline-block',
                padding: 8,
                borderRadius: 8,
              }}
            >
              <FieldTimeOutlined style={{ fontSize: 32, color: '#2f54eb' }} />
            </div>
            <Statistic
              title="总理论学时"
              value={statisticsData.totalTheoreticalHours}
              valueStyle={{ fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
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
                  />
                  <div style={{ fontSize: 13, color: '#666', minWidth: 100, textAlign: 'center' }}>
                    {minCredits} - {maxCredits} 学分
                  </div>
                </div>
              </div>
              <div className={styles['filter-item']}>
                <span className={styles['filter-label']}>排序方式</span>
                <Select value={sortBy} onChange={setSortBy} style={{ width: 160 }}>
                  <Option value="coursenumber">课程编号</Option>
                  <Option value="credits">学分</Option>
                  <Option value="theoreticalhours">理论学时</Option>{' '}
                  <Option value="experimentalhours">实验学时</Option>
                </Select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {/* 表格 + 饼图 */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={18}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>课程列表</span>
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
              <div style={{ display: 'flex', gap: 12 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse}>
                  添加课程
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleExportData}>
                  导出数据
                </Button>
                <Button icon={<UploadOutlined />} onClick={handleImportData}>
                  导入数据
                </Button>
              </div>
            }
          >
            <Table
              columns={columns}
              dataSource={courses}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ x: 1000 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card bordered={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PieChartOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontSize: 16, fontWeight: 600 }}>课程分类分布</span>
              </div>
              <Tabs activeKey={timeRange} onChange={setTimeRange} size="small">
                <TabPane tab="本月" key="month" />
                <TabPane tab="本季度" key="quarter" />
                <TabPane tab="本年度" key="year" />
              </Tabs>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getDistributionData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getDistributionData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 弹窗 */}
      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={900}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ enabledStatus: '是' }}>
          <Card title="基本信息" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="courseNumber" label="课程编号" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="coursename" label="课程名称" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="courseCategories" label="课程分类">
                  <Select>
                    <Option value="专业核心课(必修)">专业核心课(必修)</Option>
                    <Option value="专业选修课">专业选修课</Option>
                    <Option value="公共课">公共课</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="department" label="开课学院">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="credits" label="学分">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="teacher" label="任课教师">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="enabledStatus" label="状态">
                  <Select>
                    <Option value="是">启用</Option>
                    <Option value="否">禁用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="学时信息" size="small" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="theoreticalHours" label="理论学时">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="experimentalHours" label="实验学时">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="practicalHours" label="实践学时">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="课程描述" size="small" style={{ marginTop: 16 }}>
            <Form.Item name="courseDescription">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </div>
  )
}
