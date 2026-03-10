import React from 'react'
import { Row, Col, Select, Form } from 'antd'
import type { Major, Teacher } from '../../../constants/course'
import styles from '../index.module.scss'

interface Props {
  majors: Major[]
  teachers: Teacher[]
  selectedMajor: string
  selectedClass: string
  selectedStudent: string
  selectedTeacher: string
  onMajorChange: (value: string) => void
  onClassChange: (value: string) => void
  onStudentChange: (value: string) => void
  onTeacherChange: (value: string) => void
}

const FilterBar: React.FC<Props> = ({
  majors,
  teachers,
  selectedMajor,
  selectedClass,
  selectedStudent,
  selectedTeacher,
  onMajorChange,
  onClassChange,
  onStudentChange,
  onTeacherChange,
}) => {
  const currentMajor = majors.find(m => m.id === selectedMajor)
  const classes = currentMajor?.classes || []
  const students = classes.find(c => c.id === selectedClass)?.students || []

  return (
    <div className={styles.filterBar}>
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Form.Item label="专业" className={styles.filterItem}>
            <Select
              placeholder="请选择专业"
              value={selectedMajor || undefined}
              onChange={onMajorChange}
              allowClear
            >
              {majors.map(m => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="班级" className={styles.filterItem}>
            <Select
              placeholder="请选择班级"
              value={selectedClass || undefined}
              onChange={onClassChange}
              disabled={!selectedMajor}
              allowClear
            >
              {classes.map(c => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="学生" className={styles.filterItem}>
            <Select
              placeholder="请选择学生"
              value={selectedStudent || undefined}
              onChange={onStudentChange}
              disabled={!selectedClass}
              allowClear
            >
              {students.map(s => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name} ({s.studentNumber})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="教师" className={styles.filterItem}>
            <Select
              placeholder="请选择教师"
              value={selectedTeacher || undefined}
              onChange={onTeacherChange}
              allowClear
            >
              {teachers.map(t => (
                <Select.Option key={t.id} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}

export default FilterBar
