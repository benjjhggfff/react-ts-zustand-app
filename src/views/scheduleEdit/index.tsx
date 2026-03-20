import React, { useState, useCallback } from 'react'
import { Card, Spin, Button, Space, message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useScheduleData } from '../../hooks/useScheduleData'
import FilterBar from './components/FilterBar'
import ScheduleCalendar from './components/ScheduleCalendar'
import CourseModal from './components/CourseModal'
import BatchShiftModal from './components/BatchShiftModal'
import ExcelImportModal from './components/ExcelImportModal'
import HistoryModal from './components/HistoryModal' // 需要新建
import AutoScheduleModal from './components/AutoScheduleModal'
import { ScheduleOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const ScheduleEditPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    majors,
    teachers,
    courses,
    filteredCourses,
    loading,
    selectedMajor,
    selectedClass,
    selectedStudent,
    selectedTeacher,
    currentMajor,
    currentClass,
    currentStudent,
    currentTeacher,
    handleMajorChange,
    handleClassChange,
    handleStudentChange,
    handleTeacherChange,
    addCourse,
    updateCourse,
    deleteCourse,
    batchShiftByClass,
    batchShiftByTeacher,
    importFromExcel,
    exportToExcel,
    // 新属性
    currentUser,
    history,
    historyIndex,
    undo,
    rollbackToHistory,
    pushHistory,
  } = useScheduleData()

  const [modalVisible, setModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // 批量偏移弹窗状态
  const [batchShiftVisible, setBatchShiftVisible] = useState(false)
  const [batchShiftTarget, setBatchShiftTarget] = useState<{
    type: 'class' | 'teacher'
    id: string
    name: string
  } | null>(null)

  // Excel 导入弹窗
  const [importVisible, setImportVisible] = useState(false)

  // 历史版本弹窗
  const [historyVisible, setHistoryVisible] = useState(false)

  // 自动排课弹窗
  const [autoScheduleVisible, setAutoScheduleVisible] = useState(false)

  // 日历事件处理
  const handleEventClick = useCallback(
    (event: any) => {
      const course = filteredCourses.find(c => c.id === event.id)
      if (course) {
        setEditingCourse(course)
        setModalVisible(true)
      }
    },
    [filteredCourses]
  )

  const handleDateClick = useCallback((dateStr: string) => {
    setEditingCourse(null)
    setModalVisible(true)
  }, [])

  const handleEventDrop = useCallback(
    (info: any) => {
      const { event } = info
      const success = updateCourse(event.id, {
        start: event.startStr,
        end: event.endStr,
      })
      if (!success) {
        info.revert()
      }
    },
    [updateCourse]
  )

  const handleModalSubmit = useCallback(
    (values: any) => {
      setModalLoading(true)
      setTimeout(() => {
        let success = false
        if (editingCourse) {
          success = updateCourse(editingCourse.id, values)
        } else {
          success = addCourse({
            ...values,
            classId: selectedClass || undefined,
            teacherId: teachers.find(t => t.name === values.teacher)?.id,
          })
        }
        if (success) {
          setModalVisible(false)
        }
        setModalLoading(false)
      }, 500)
    },
    [editingCourse, addCourse, updateCourse, selectedClass, teachers]
  )

  // 批量偏移确认
  const handleBatchShiftConfirm = useCallback(
    async (days: number, type: 'class' | 'teacher', id: string) => {
      let result
      if (type === 'class') {
        result = batchShiftByClass(id, days)
      } else {
        result = batchShiftByTeacher(id, days)
      }
      return result.success
    },
    [batchShiftByClass, batchShiftByTeacher]
  )

  // 打开批量偏移弹窗（班级）
  const openBatchShiftForClass = () => {
    if (!selectedClass) {
      message.warning('请先选择班级')
      return
    }
    setBatchShiftTarget({
      type: 'class',
      id: selectedClass,
      name: currentClass?.name || '',
    })
    setBatchShiftVisible(true)
  }

  // 打开批量偏移弹窗（教师）
  const openBatchShiftForTeacher = () => {
    if (!selectedTeacher) {
      message.warning('请先选择教师')
      return
    }
    setBatchShiftTarget({
      type: 'teacher',
      id: selectedTeacher,
      name: currentTeacher?.name || '',
    })
    setBatchShiftVisible(true)
  }

  // 导出当前筛选后的课程
  const handleExport = () => {
    exportToExcel(filteredCourses)
  }

  // 自动排课处理
  const handleAutoSchedule = useCallback(
    (result: { success: boolean; message: string; courses?: any[] }) => {
      if (result.success && result.courses) {
        // 保存历史
        pushHistory()
        // 添加自动排课的课程
        result.courses.forEach(course => {
          addCourse({
            title: course.title,
            teacher: course.teacher,
            teacherId: course.teacherId,
            location: course.location,
            start: course.start,
            end: course.end,
            classId: course.classId,
            type: course.type,
            tags: course.tags,
          })
        })
        message.success(result.message)
        notification.success({
          message: '自动排课成功',
          description: `成功为所选班级安排了 ${result.courses.length} 门课程`,
        })
      } else {
        message.error(result.message)
      }
      setAutoScheduleVisible(false)
    },
    [pushHistory, addCourse]
  )

  // 标题
  const getTitle = () => {
    const parts = []
    if (currentMajor) parts.push(currentMajor.name)
    if (currentClass) parts.push(currentClass.name)
    if (currentStudent) parts.push(currentStudent.name)
    if (currentTeacher) parts.push(currentTeacher.name)
    return `课程表 - ${parts.join(' - ') || '全部'}`
  }

  // 角色显示文本
  const getRoleText = () => {
    switch (currentUser.role) {
      case 'admin':
        return '管理员'
      case 'teacher':
        return '教师'
      case 'student':
        return '学生'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="加载数据中..." />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card className={styles.filterCard} bordered={false}>
        <div className={styles.roleHistoryBar}>
          <Space>
            <Button onClick={undo} disabled={historyIndex <= 0}>
              撤销
            </Button>
            <Button onClick={() => setHistoryVisible(true)} disabled={history.length <= 1}>
              历史版本
            </Button>
          </Space>
        </div>
        <FilterBar
          majors={majors}
          teachers={teachers}
          selectedMajor={selectedMajor}
          selectedClass={selectedClass}
          selectedStudent={selectedStudent}
          selectedTeacher={selectedTeacher}
          onMajorChange={handleMajorChange}
          onClassChange={handleClassChange}
          onStudentChange={handleStudentChange}
          onTeacherChange={handleTeacherChange}
        />

        <div className={styles.batchActions}>
          <Space wrap>
            <Button
              type="primary"
              icon={<ScheduleOutlined />}
              onClick={() => setAutoScheduleVisible(true)}
            >
              自动排课
            </Button>
            <Button onClick={openBatchShiftForClass} disabled={!selectedClass}>
              班级批量偏移
            </Button>
            <Button onClick={openBatchShiftForTeacher} disabled={!selectedTeacher}>
              教师批量偏移
            </Button>
            <Button onClick={() => setImportVisible(true)}>Excel导入</Button>
            <Button onClick={handleExport} disabled={filteredCourses.length === 0}>
              Excel导出
            </Button>
          </Space>
        </div>
      </Card>

      <Card title={getTitle()} className={styles.calendarCard} bordered={false}>
        <ScheduleCalendar
          courses={filteredCourses}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
          onDateClick={handleDateClick}
        />
      </Card>

      <CourseModal
        visible={modalVisible}
        editingCourse={editingCourse}
        teachers={teachers}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        confirmLoading={modalLoading}
      />

      {batchShiftTarget && (
        <BatchShiftModal
          visible={batchShiftVisible}
          onCancel={() => setBatchShiftVisible(false)}
          onConfirm={handleBatchShiftConfirm}
          targetType={batchShiftTarget.type}
          targetId={batchShiftTarget.id}
          targetName={batchShiftTarget.name}
        />
      )}

      <ExcelImportModal
        visible={importVisible}
        onCancel={() => setImportVisible(false)}
        onImport={async file => {
          const result = await importFromExcel(file)
          return result
        }}
      />

      <HistoryModal
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        history={history}
        currentIndex={historyIndex}
        onRollback={rollbackToHistory}
      />

      <AutoScheduleModal
        visible={autoScheduleVisible}
        onCancel={() => setAutoScheduleVisible(false)}
        onConfirm={handleAutoSchedule}
        majors={majors}
        teachers={teachers}
        existingCourses={courses}
      />
    </div>
  )
}

export default ScheduleEditPage
