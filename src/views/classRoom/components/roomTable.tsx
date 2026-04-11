import {
  Table,
  Row,
  Col,
  Descriptions,
  Badge,
  Progress,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  DatePicker,
  TimePicker,
} from 'antd'
import type { TableColumnsType } from 'antd'
import { supabase } from '../../../service/supabase'
import { useSelector } from 'react-redux'
import { useEffect, useState, memo } from 'react'
import {
  getClassrooms,
  addClassroom,
  updateClassroom,
  deleteClassroom,
  applyClassroom,
} from '../../../api/classroom'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLocalCache } from '../../../hooks/useLocalCache/useLocalCache'
// 判断用户身份

interface DeviceType {
  id: number
  name: string
}

interface ClassroomDataType {
  id: React.Key
  code: string
  building: number
  type: number
  capacity: number
  status: number
  classroom_name: string
  location: string
  management_dept: number
  description: string

  max_capacity: number
  standard_capacity: number
  area: string
  weekly_usage: number

  air_conditioner: number
  projector: number
  microphone: number
  light: number
  apply_count: number
  classroom_devices?: {
    devices: {
      id: number
      name: string
    }
  }[]
}

// ✅ 已修复 Props
interface RoomTableProps {
  searchText: string
  typeFilter?: number
  statusFilter?: number
  timeFilter?: string

  setTotalRooms: (n: number) => void
  setUsableRooms: (n: number) => void
  setTodayApplies: (n: number) => void
  setTotalApplies: (n: number) => void
}

const RoomTable: React.FC<RoomTableProps> = ({
  searchText,
  typeFilter,
  statusFilter,
  timeFilter,

  setTotalRooms,
  setUsableRooms,
  setTodayApplies,
  setTotalApplies,
}) => {
  // const [dataSource, setDataSource] = useState<ClassroomDataType[]>([])

  const [modalVisible, setModalVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ClassroomDataType | null>(null)
  const [form] = Form.useForm()
  const [applyModalVisible, setApplyModalVisible] = useState(false)
  const [applyForm] = Form.useForm()
  const [currentApplyRoom, setCurrentApplyRoom] = useState<ClassroomDataType | null>(null)
  const [applications, setApplications] = useState<any[]>([])
  const { data: classrooms = [], refetch: refetchClassrooms } = useLocalCache<ClassroomDataType[]>({
    key: 'classrooms',
    fetcher: getClassrooms,
    staleTime: 30 * 60 * 1000 * 2 * 24,
  })
  const refreshData = () => {
    refetchClassrooms()
  }
  const filteredList = useMemo(() => {
    return classrooms.filter(item => {
      const matchSearch = item.classroom_name.includes(searchText) || item.code.includes(searchText)
      const matchType = typeFilter === undefined || item.type === typeFilter
      const matchStatus = statusFilter === undefined || item.status === statusFilter
      const matchTime = timeFilter === undefined || true
      return matchSearch && matchType && matchStatus
    })
  }, [classrooms, searchText, typeFilter, statusFilter, timeFilter])

  const { data: devices = [], isLoading: devicesLoading } = useLocalCache<DeviceType[]>({
    key: 'devices',
    fetcher: async () => {
      const { data } = await supabase.from('devices').select('id,name')
      return data as DeviceType[]
    },
    staleTime: 30 * 60 * 1000 * 2 * 24,
  })

  const handleApply = (record: ClassroomDataType) => {
    setCurrentApplyRoom(record)
    applyForm.resetFields()
    setApplyModalVisible(true)
  }

  const handleSubmitApply = async () => {
    if (!currentApplyRoom) return
    try {
      const values = await applyForm.validateFields()
      await applyClassroom({
        classroom_id: currentApplyRoom.id as number,
        use_date: values.date.format('YYYY-MM-DD'),
        start_time: values.start.format('HH:mm:ss'),
        end_time: values.end.format('HH:mm:ss'),
        purpose: values.purpose,
      })
      message.success('预约成功')
      setApplyModalVisible(false)
    } catch (err) {
      console.error('预约失败', err)
    }
  }

  const fetchApplications = async () => {
    try {
      const { data } = await supabase.from('applications').select('*')
      setApplications(data || [])
    } catch (err) {
      console.error('获取预约失败', err)
    }
  }
  const handleAdd = () => {
    setIsEdit(false)
    form.resetFields()
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确定删除？',
      content: '无法恢复',
      okType: 'danger',
      onOk: async () => {
        await deleteClassroom(id)
        message.success('删除成功')
        refreshData()
      },
    })
  }

  const handleEdit = (record: ClassroomDataType) => {
    setIsEdit(true)
    setCurrentRecord(record)
    form.setFieldsValue({
      ...record,
      device_ids: record.classroom_devices?.map(i => i.devices?.id).filter(Boolean) || [],
    })
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (isEdit && currentRecord) {
        await updateClassroom(currentRecord.id as number, values)
        message.success('编辑成功')
      } else {
        await addClassroom(values)
        message.success('新增成功')
      }
      setModalVisible(false)
      refreshData()
    } catch (err) {
      console.error('提交失败', err)
    }
  }
  const { userInfo } = useSelector((state: any) => state.user)
  const isAdmin = userInfo?.role === 'admin'
  useEffect(() => {
    refreshData()
    fetchApplications()
  }, [])

  // ✅ 已修复统计逻辑
  useEffect(() => {
    if (!classrooms.length) return

    // 总数
    setTotalRooms(classrooms.length)

    // 可用数
    setUsableRooms(classrooms.filter(r => r.status === 1).length)

    // 总预约次数
    const total = classrooms.reduce((sum, r) => sum + (r.apply_count || 0), 0)
    setTotalApplies(total)

    // ✅ 今日预约（匹配你数据库格式：2026-03-27 13:08:28）
    const today = dayjs().format('YYYY-MM-DD') // 2026-03-28

    const todayCount = applications.filter(item => {
      if (!item.use_date) return false
      return item.use_date.startsWith(today)
    }).length

    setTodayApplies(todayCount)
  }, [classrooms, applications])

  const columns = useMemo<TableColumnsType<ClassroomDataType>>(
    () => [
      {
        title: '教室名称',
        key: 'classroom_name',
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <span>{record.classroom_name}</span>
            <span style={{ color: '#999', fontSize: 12 }}>{record.code}</span>
          </Space>
        ),
      },
      { title: '位置', dataIndex: 'location' },
      {
        title: '类型',
        dataIndex: 'type',
        render: type => {
          const map: Record<number, string> = {
            1: '普通教室',
            2: '实训车间',
            3: '实验室',
            4: '机房',
            5: '艺术教室',
            6: '会议室',
          }
          return <Badge status="processing" text={map[type] || '未知'} />
        },
      },
      { title: '容量', render: (_, r) => `${r.capacity}人` },
      {
        title: '核心设备',
        render: (_, record) => {
          const list = record.classroom_devices || []
          const names = list.map(i => i.devices?.name).filter(Boolean)
          return names.join('、') || '无设备'
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: s => (
          <Badge status={s === 1 ? 'success' : 'error'} text={s === 1 ? '可用' : '不可用'} />
        ),
      },
      {
        title: '预约次数',
        render: (_, record) => <span>{record.apply_count} 次</span>,
      },
      {
        title: '操作',
        render: (_, record) => (
          <Space size="small">
            {isAdmin && <a onClick={() => handleEdit(record)}>编辑</a>}

            <a onClick={() => handleApply(record)}>预约</a>
            {isAdmin && (
              <a style={{ color: '#f5222d' }} onClick={() => handleDelete(record.id as number)}>
                删除
              </a>
            )}
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete, handleApply, isAdmin]
  )

  const expandedRowRender = useMemo(
    () => (record: ClassroomDataType) => (
      <Row gutter={24} style={{ margin: '16px 0' }}>
        <Col span={8}>
          <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>基础信息</h4>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="教室编号">{record.code}</Descriptions.Item>
            <Descriptions.Item label="管理部门">{record.management_dept}</Descriptions.Item>
            <Descriptions.Item label="位置">{record.location}</Descriptions.Item>
            <Descriptions.Item label="描述">{record.description || '无'}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>设备状态</h4>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="空调">
              {record.air_conditioner ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="投影仪">
              {record.projector ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="麦克风">
              {record.microphone ? '开启' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="灯光">{record.light ? '开启' : '关闭'}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>空间信息</h4>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="最大容量">{record.max_capacity}</Descriptions.Item>
            <Descriptions.Item label="标准容量">
              {record.standard_capacity || '未设置'}
            </Descriptions.Item>
            <Descriptions.Item label="面积">{record.area || '未记录'}</Descriptions.Item>
            <Descriptions.Item label="本周使用时长">{record.weekly_usage} 小时</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    ),
    []
  )

  return (
    <div style={{ padding: 16, background: '#fff' }}>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          onClick={handleAdd}
          style={{ backgroundColor: '#cec6e1', color: '#fff', width: 'fit-content' }}
        >
          新增教室
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredList}
        expandable={{ expandedRowRender, expandRowByClick: true }}
        rowKey="id"
        bordered
        pagination={false}
      />

      <Modal
        title={isEdit ? '编辑教室' : '新增教室'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
        okText="确定"
        cancelText="取消"
        okButtonProps={{
          type: 'primary',

          style: { backgroundColor: '#1677ff', borderColor: '#1677ff', width: 'fit-content' },
        }}
        // 👇 控制取消按钮样式
        cancelButtonProps={{
          style: { width: 'fit-content' },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="教室名称" name="classroom_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="教室编号" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="位置" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Select>
              <Select.Option value={1}>普通教室</Select.Option>
              <Select.Option value={2}>实训车间</Select.Option>
              <Select.Option value={3}>实验室</Select.Option>
              <Select.Option value={4}>机房</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="教学楼" name="building" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="容量" name="capacity">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="设备" name="device_ids">
            <Select mode="multiple">
              {devices.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select>
              <Select.Option value={1}>可用</Select.Option>
              <Select.Option value={0}>不可用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="预约教室"
        open={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        onOk={handleSubmitApply}
        okText="确定"
        cancelText="取消"
        width={500}
        okButtonProps={{
          type: 'primary',

          style: { backgroundColor: '#1677ff', borderColor: '#1677ff', width: 'fit-content' },
        }}
        // 👇 控制取消按钮样式
        cancelButtonProps={{
          style: { width: 'fit-content' },
        }}
      >
        <Form form={applyForm} layout="vertical">
          <Form.Item name="date" label="使用日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="start" label="开始时间" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="end" label="结束时间" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="purpose" label="使用用途">
            <Input placeholder="上课/会议/实训等" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default memo(RoomTable)
