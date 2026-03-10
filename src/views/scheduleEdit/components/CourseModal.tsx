// components/CourseModal.tsx
import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker } from 'antd'
import type { Teacher } from '../../../constants/course'

import dayjs from 'dayjs'
import styles from '../index.module.scss'

const { RangePicker } = DatePicker

interface Props {
  visible: boolean
  editingCourse: any // 实际类型应为 Course | null
  teachers: Teacher[]
  onCancel: () => void
  onSubmit: (values: any) => void
  confirmLoading?: boolean
}

const CourseModal: React.FC<Props> = ({
  visible,
  editingCourse,
  teachers,
  onCancel,
  onSubmit,
  confirmLoading = false,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      if (editingCourse) {
        form.setFieldsValue({
          title: editingCourse.title,
          teacher: editingCourse.teacher,
          location: editingCourse.location,
        })
      } else {
        form.resetFields()
      }
    }
  }, [visible, editingCourse, form])

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingCourse) {
        onSubmit({ ...values, id: editingCourse.id })
      } else {
        // 转换日期时间为 ISO 字符串
        const [start, end] = values.timeRange.map((d: dayjs.Dayjs) => d.toISOString())
        onSubmit({ ...values, start, end })
      }
    })
  }

  return (
    <Modal
      title={editingCourse ? '编辑课程' : '新增课程'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
      className={styles.courseModal}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="课程名称"
          rules={[{ required: true, message: '请输入课程名称' }]}
        >
          <Input placeholder="例如：高等数学" />
        </Form.Item>
        <Form.Item
          name="teacher"
          label="任课教师"
          rules={[{ required: true, message: '请选择任课教师' }]}
        >
          <Select placeholder="请选择">
            {teachers.map(t => (
              <Select.Option key={t.id} value={t.name}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="location"
          label="上课地点"
          rules={[{ required: true, message: '请输入上课地点' }]}
        >
          <Input placeholder="例如：A101" />
        </Form.Item>
        {!editingCourse && (
          <Form.Item
            name="timeRange"
            label="上课时间"
            rules={[{ required: true, message: '请选择上课时间' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default CourseModal
