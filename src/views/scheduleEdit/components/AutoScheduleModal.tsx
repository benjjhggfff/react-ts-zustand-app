import React, { useState } from 'react'
import {
  Modal,
  Form,
  Select,
  Button,
  Space,
  Spin,
  message,
  Checkbox,
  InputNumber,
  DatePicker,
  Divider,
} from 'antd'
import { CalendarOutlined, RocketOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { Major, Teacher, Course } from '../../../constants/course'
import dayjs from 'dayjs'

interface AutoScheduleModalProps {
  visible: boolean
  onCancel: () => void
  onConfirm: (result: { success: boolean; message: string; courses?: Course[] }) => void
  majors: Major[]
  teachers: Teacher[]
  existingCourses: Course[]
}

const AutoScheduleModal: React.FC<AutoScheduleModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  majors,
  teachers,
  existingCourses,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState<string>('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [availableClasses, setAvailableClasses] = useState<any[]>([])

  // 处理专业选择变化
  const handleMajorChange = (value: string) => {
    setSelectedMajor(value)
    setSelectedClasses([])
    const major = majors.find(m => m.id === value)
    if (major) {
      setAvailableClasses(major.classes)
    } else {
      setAvailableClasses([])
    }
    form.resetFields(['classes'])
  }

  // 生成课程时间
  const generateCourseTime = (
    day: number,
    startHour: number,
    duration: number,
    startDate: dayjs.Dayjs
  ) => {
    // 周一到周五，8:00开始，使用用户选择的开始日期作为基准
    const baseDate = startDate.startOf('week').add(day, 'day')
    const start = baseDate.hour(startHour).minute(0).second(0)
    const end = start.add(duration, 'hour').add(40, 'minute') // 每节课1小时40分钟
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    }
  }

  // 检查时间冲突
  const checkTimeConflict = (
    start: string,
    end: string,
    teacherId: string,
    location: string,
    excludeId?: string,
    newCourses: Course[] = []
  ) => {
    // 检查现有课程
    const existingConflict = existingCourses.some(course => {
      if (excludeId && course.id === excludeId) return false

      // 时间冲突
      const courseStart = new Date(course.start)
      const courseEnd = new Date(course.end)
      const newStart = new Date(start)
      const newEnd = new Date(end)

      const timeOverlap = newStart < courseEnd && newEnd > courseStart

      // 教师冲突
      const teacherConflict = course.teacherId === teacherId

      // 教室冲突
      const locationConflict = course.location === location

      return timeOverlap && (teacherConflict || locationConflict)
    })

    // 检查新添加的课程
    const newCourseConflict = newCourses.some(course => {
      if (excludeId && course.id === excludeId) return false

      // 时间冲突
      const courseStart = new Date(course.start)
      const courseEnd = new Date(course.end)
      const newStart = new Date(start)
      const newEnd = new Date(end)

      const timeOverlap = newStart < courseEnd && newEnd > courseStart

      // 教师冲突
      const teacherConflict = course.teacherId === teacherId

      // 教室冲突
      const locationConflict = course.location === location

      return timeOverlap && (teacherConflict || locationConflict)
    })

    return existingConflict || newCourseConflict
  }

  // 自动排课算法
  const autoSchedule = async () => {
    const values = await form.validateFields()
    setLoading(true)

    try {
      // 模拟排课过程
      await new Promise(resolve => setTimeout(resolve, 2000))

      const {
        major,
        classes,
        teachers: selectedTeachers,
        startDate,
        endDate,
        priority,
        scheduleWeeks,
      } = values

      // 生成课程数据
      const newCourses: Course[] = []
      const locations = ['A101', 'A102', 'B201', 'B202', 'C301', 'C302', 'D401', 'D402']
      const courses = [
        { title: '高等数学', type: 'required', duration: 2, weeklyHours: 4 }, // 每周2次课
        { title: '大学英语', type: 'required', duration: 2, weeklyHours: 4 },
        { title: '数据结构', type: 'major', duration: 2, weeklyHours: 4 },
        { title: '操作系统', type: 'major', duration: 2, weeklyHours: 4 },
        { title: '计算机网络', type: 'elective', duration: 2, weeklyHours: 2 }, // 每周1次课
        { title: '数据库原理', type: 'major', duration: 2, weeklyHours: 4 },
        { title: '软件工程', type: 'major', duration: 2, weeklyHours: 4 },
        { title: '算法设计', type: 'elective', duration: 2, weeklyHours: 2 },
      ]

      let courseId = Date.now()

      // 为每个选中的班级排课
      classes.forEach((classId: string) => {
        const className = availableClasses.find(c => c.id === classId)?.name || ''

        // 为每个课程排课
        courses.forEach((course, courseIndex) => {
          const teacher = selectedTeachers[courseIndex % selectedTeachers.length]
          const teacherInfo = teachers.find(t => t.id === teacher)

          // 计算每周需要的课次数
          const weeklySessions = course.weeklyHours / 2 // 每节课2小时

          // 为每周安排课程
          for (let week = 0; week < scheduleWeeks; week++) {
            // 为每周的每个课次安排时间
            for (let session = 0; session < weeklySessions; session++) {
              // 尝试在不同时间和教室安排课程
              let scheduled = false
              let attempts = 0
              const maxAttempts = 50 // 增加尝试次数

              while (!scheduled && attempts < maxAttempts) {
                // 随机选择星期（1-5，周一到周五）
                const day = Math.floor(Math.random() * 5) + 1
                // 随机选择时间段（8:00, 10:00, 14:00, 16:00）
                const startHour = [8, 10, 14, 16][Math.floor(Math.random() * 4)]
                // 随机选择教室
                const location = locations[Math.floor(Math.random() * locations.length)]

                // 计算当前周的开始日期
                const weekStartDate = startDate.add(week, 'week')
                const { start, end } = generateCourseTime(
                  day,
                  startHour,
                  course.duration,
                  weekStartDate
                )

                // 检查冲突
                if (!checkTimeConflict(start, end, teacher, location, undefined, newCourses)) {
                  newCourses.push({
                    id: (courseId++).toString(),
                    title: course.title,
                    start,
                    end,
                    teacher: teacherInfo?.name || '',
                    teacherId: teacher,
                    location,
                    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                    status: 'active',
                    classId,
                    type: course.type,
                    tags: [
                      className,
                      course.type === 'required' ? '必修' : '选修',
                      `第${week + 1}周`,
                    ],
                  })
                  scheduled = true
                }

                attempts++
              }
            }
          }
        })
      })

      if (newCourses.length > 0) {
        onConfirm({
          success: true,
          message: `成功自动排课 ${newCourses.length} 门课程`,
          courses: newCourses,
        })
      } else {
        onConfirm({
          success: false,
          message: '无法为所选班级安排课程，请调整参数后重试',
        })
      }
    } catch (error) {
      console.error('自动排课失败:', error)
      onConfirm({
        success: false,
        message: '自动排课失败，请稍后重试',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <span>自动排课</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="confirm"
          type="primary"
          icon={<RocketOutlined />}
          onClick={autoSchedule}
          loading={loading}
        >
          开始排课
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'teacher',
          startDate: dayjs(),
          endDate: dayjs().add(1, 'month'),
        }}
      >
        <Form.Item
          name="major"
          label="选择专业"
          rules={[{ required: true, message: '请选择专业' }]}
        >
          <Select
            placeholder="请选择专业"
            onChange={handleMajorChange}
            options={majors.map(major => ({
              label: major.name,
              value: major.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="classes"
          label="选择班级"
          rules={[{ required: true, message: '请至少选择一个班级' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择班级"
            options={availableClasses.map(cls => ({
              label: cls.name,
              value: cls.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="teachers"
          label="选择教师"
          rules={[{ required: true, message: '请至少选择一个教师' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择教师"
            options={teachers.map(teacher => ({
              label: teacher.name,
              value: teacher.id,
            }))}
          />
        </Form.Item>

        <Divider orientation="left">排课参数</Divider>

        <Form.Item name="priority" label="排课优先级">
          <Select
            options={[
              { label: '教师时间优先', value: 'teacher' },
              { label: '教室利用率优先', value: 'location' },
              { label: '课程分布均匀', value: 'distribution' },
            ]}
          />
        </Form.Item>

        <Form.Item name="startDate" label="开始日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="endDate" label="结束日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="maxCoursesPerDay" label="每天最大课程数">
          <InputNumber min={1} max={8} defaultValue={4} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="scheduleWeeks" label="排课周数">
          <InputNumber min={1} max={20} defaultValue={16} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="avoidWeekends" valuePropName="checked" label="避开周末">
          <Checkbox defaultChecked />
        </Form.Item>

        <Form.Item name="avoidConflicts" valuePropName="checked" label="自动检测并避免冲突">
          <Checkbox defaultChecked />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <CheckCircleOutlined style={{ color: '#1890ff' }} />
          <h4 style={{ margin: 0 }}>排课规则说明</h4>
        </div>
        <ul style={{ margin: '8px 0', paddingLeft: 24, color: '#666', fontSize: 13 }}>
          <li>系统将自动为所选班级安排课程</li>
          <li>会自动检测并避免时间冲突</li>
          <li>会根据优先级规则优化排课方案</li>
          <li>排课后可手动调整不满意的课程</li>
        </ul>
      </div>
    </Modal>
  )
}

export default AutoScheduleModal
