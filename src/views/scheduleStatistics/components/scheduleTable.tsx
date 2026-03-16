import React, { useState } from 'react'
import {
  Table,
  Row,
  Col,
  Descriptions,
  Badge,
  Space,
  Button,
  Tag,
  Popover,
  Tooltip,
  Checkbox,
  Select,
} from 'antd'
import type { TableColumnsType } from 'antd'

// 定义排课数据类型
interface ScheduleDataType {
  key: React.Key
  courseId: string // 课程编号
  courseName: string // 课程名称
  teacherInfo: {
    name: string
    title: string
    college: string
    phone: string
    weeklyHours: number
  } // 授课教师
  classInfo: {
    name: string
    count: number
    capacity: number
    overload: boolean
  } // 上课班级
  roomInfo: {
    name: string
    capacity: number
    type: string
    equipment: string[]
  } // 上课教室
  scheduleTime: {
    weeks: string
    day: string
    period: string
    isContinuous: boolean
  } // 上课时间
  courseNature: string // 课程性质
  creditHours: string // 学分/课时
  status: string // 排课状态
  conflictInfo: string // 冲突说明
}

// 模拟排课数据
const dataSource: ScheduleDataType[] = [
  {
    key: '1',
    courseId: 'CS2024001',
    courseName: '高等数学（上）',
    teacherInfo: {
      name: '张明',
      title: '教授',
      college: '理学院',
      phone: '1381234',
      weeklyHours: 18,
    },
    classInfo: {
      name: '计算机 2301-2304',
      count: 115,
      capacity: 120,
      overload: false,
    },
    roomInfo: {
      name: 'A101',
      capacity: 120,
      type: '多媒体',
      equipment: ['投影仪', '音响', '电子白板'],
    },
    scheduleTime: {
      weeks: '1-18 周',
      day: '周一',
      period: '1-2 节',
      isContinuous: false,
    },
    courseNature: '必修',
    creditHours: '4 学分 / 72 课时',
    status: '正常',
    conflictInfo: '-',
  },
  {
    key: '2',
    courseId: 'CS2024003',
    courseName: '程序设计实验',
    teacherInfo: {
      name: '王芳',
      title: '讲师',
      college: '计算机学院',
      phone: '1395678',
      weeklyHours: 22,
    },
    classInfo: {
      name: '计算机 2301',
      count: 48,
      capacity: 50,
      overload: false,
    },
    roomInfo: {
      name: '实验楼 302',
      capacity: 50,
      type: '计算机实验室',
      equipment: ['50 台 PC', '投影仪', '实验箱'],
    },
    scheduleTime: {
      weeks: '1-18 周',
      day: '周三',
      period: '5-8 节',
      isContinuous: true,
    },
    courseNature: '实验',
    creditHours: '3 学分 / 54 课时',
    status: '正常',
    conflictInfo: '-',
  },
  {
    key: '3',
    courseId: 'CS2024005',
    courseName: '数据结构',
    teacherInfo: {
      name: '李明',
      title: '副教授',
      college: '计算机学院',
      phone: '137****9012',
      weeklyHours: 20,
    },
    classInfo: {
      name: '计算机 2302-2303',
      count: 92,
      capacity: 90,
      overload: true,
    },
    roomInfo: {
      name: 'B205',
      capacity: 90,
      type: '多媒体',
      equipment: ['投影仪', '音响'],
    },
    scheduleTime: {
      weeks: '1-18 周',
      day: '周五',
      period: '3-4 节',
      isContinuous: false,
    },
    courseNature: '必修',
    creditHours: '4 学分 / 72 课时',
    status: '冲突',
    conflictInfo: '教室超员 2 人',
  },
]

// 课程性质标签颜色
const natureColors = {
  必修: 'blue',
  选修: 'green',
  实验: 'orange',
  实践: 'purple',
}

// 状态配置
const statusConfig = {
  正常: { color: 'green', icon: 'check' },
  待确认: { color: 'orange', icon: 'clock' },
  冲突预警: { color: 'red', icon: 'warning' },
  已调课: { color: 'blue', icon: 'swap' },
}

// 表格列配置
const columns: TableColumnsType<ScheduleDataType> = [
  {
    title: '课程编号',
    dataIndex: 'courseId',
    key: 'courseId',
    width: 100,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '课程名称',
    dataIndex: 'courseName',
    key: 'courseName',
    width: 150,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '授课教师',
    key: 'teacherInfo',
    width: 180,
    align: 'center',
    render: (_, record) => {
      const { name, title, college, phone, weeklyHours } = record.teacherInfo
      return (
        <Popover
          content={
            <div>
              <p>姓名: {name}</p>
              <p>职称: {title}</p>
              <p>学院: {college}</p>
              <p>电话: {phone}</p>
              <p>本周课时: {weeklyHours}</p>
            </div>
          }
          title="教师信息"
        >
          <span>
            {name} {title} ({college})
          </span>
        </Popover>
      )
    },
  },
  {
    title: '上课班级',
    key: 'classInfo',
    width: 200,
    align: 'center',
    render: (_, record) => {
      const { name, count, capacity, overload } = record.classInfo
      return (
        <Popover
          content={
            <div>
              <p>班级名称: {name}</p>
              <p>
                人数: {count}/{capacity}
              </p>
              <p>是否超员: {overload ? '是' : '否'}</p>
            </div>
          }
          title="班级信息"
        >
          <span style={{ color: overload ? 'red' : 'inherit' }}>
            {name} ({count}/{capacity})
          </span>
        </Popover>
      )
    },
  },
  {
    title: '上课教室',
    key: 'roomInfo',
    width: 180,
    align: 'center',
    render: (_, record) => {
      const { name, capacity, type, equipment } = record.roomInfo
      return (
        <Popover
          content={
            <div>
              <p>教室名称: {name}</p>
              <p>容量: {capacity}</p>
              <p>类型: {type}</p>
              <p>设备: {equipment.join(', ')}</p>
            </div>
          }
          title="教室信息"
        >
          <span>
            {name} ({capacity}) {type}
          </span>
        </Popover>
      )
    },
  },
  {
    title: '上课时间',
    key: 'scheduleTime',
    width: 220,
    align: 'center',
    render: (_, record) => {
      const { weeks, day, period, isContinuous } = record.scheduleTime
      return (
        <span>
          {weeks} {day} {period} {isContinuous && <Tag color="blue">连</Tag>}
        </span>
      )
    },
  },
  {
    title: '课程性质',
    dataIndex: 'courseNature',
    key: 'courseNature',
    width: 120,
    align: 'center',
    render: nature => <Tag color={natureColors[nature as keyof typeof natureColors]}>{nature}</Tag>,
  },
  {
    title: '学分 / 课时',
    dataIndex: 'creditHours',
    key: 'creditHours',
    width: 180,
    align: 'center',
  },
  {
    title: '排课状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center',
    render: status => {
      const config = statusConfig[status as keyof typeof statusConfig]
      return (
        <Tag
          color={
            config?.color === 'green'
              ? 'green'
              : config?.color === 'orange'
                ? 'orange'
                : config?.color === 'red'
                  ? 'red'
                  : 'blue'
          }
        >
          {status}
        </Tag>
      )
    },
  },
  {
    title: '冲突说明',
    dataIndex: 'conflictInfo',
    key: 'conflictInfo',
    width: 200,
    align: 'center',
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    align: 'center',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
        <Space size="small">
          <Tag color="blue">查看详情</Tag>
          <Tag color="green">申请调课</Tag>
        </Space>
        <Space size="small">
          <Tag color="blue">调整教室</Tag>
          <Tag color="green">删除记录</Tag>
        </Space>
      </div>
    ),
  },
]

// 展开行渲染
const expandedRowRender = (record: ScheduleDataType) => (
  <Row gutter={24} style={{ margin: '16px 0' }}>
    {/* 排课历史 */}
    <Col span={8}>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>排课历史</h4>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="首次排课">2026-02-20</Descriptions.Item>
        <Descriptions.Item label="最近调整">2026-03-01</Descriptions.Item>
      </Descriptions>
    </Col>
    {/* 调课记录 */}
    <Col span={8}>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>调课记录</h4>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="调课次数">0</Descriptions.Item>
        <Descriptions.Item label="最近调课">无</Descriptions.Item>
      </Descriptions>
    </Col>
    {/* 学生名单预览 */}
    <Col span={8}>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>学生名单预览</h4>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="总人数">{record.classInfo.count}</Descriptions.Item>
        <Descriptions.Item label="预览">
          {record.classInfo.name.split('-')[0]} 等 {record.classInfo.count} 人
        </Descriptions.Item>
      </Descriptions>
    </Col>
  </Row>
)

// 完整表格组件
const ScheduleTable: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <div
      style={{
        padding: 10,
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* 批量操作栏 */}
      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Button type="default" disabled={selectedRowKeys.length === 0}>
            批量确认
          </Button>
          <Button disabled={selectedRowKeys.length === 0}>批量导出</Button>
          <Button type="default" disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </Space>
        <Space>
          <Select
            placeholder="导出格式"
            style={{ width: 120 }}
            options={[
              { label: 'Excel', value: 'xlsx' },
              { label: 'CSV', value: 'csv' },
              { label: 'PDF', value: 'pdf' },
            ]}
          />
          <Button type="default">导出全部</Button>
          <Button type="default">导出选中</Button>
        </Space>
      </div>

      {/* 排课列表表格 */}
      <Table<ScheduleDataType>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
        }}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 20,
          total: dataSource.length,
          showTotal: total => `共 ${total} 条记录`,
          showJumper: true,
          style: {
            textAlign: 'center',
          },
        }}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
        rowClassName={record => (record.status === '冲突预警' ? 'conflict-row' : '')}
      />

      {/* 汇总行 */}
      <div
        style={{
          marginTop: 10,
          padding: 10,
          background: '#f5f5f5',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div>
          总课程数: <strong>1256</strong>
        </div>
        <div>
          涉及教师: <strong>234</strong>
        </div>
        <div>
          覆盖班级: <strong>89</strong>
        </div>
        <div style={{ color: 'red' }}>
          冲突课程: <strong>3</strong>
        </div>
        <div style={{ color: 'orange' }}>
          待确认: <strong>12</strong>
        </div>
      </div>
    </div>
  )
}

export default ScheduleTable
