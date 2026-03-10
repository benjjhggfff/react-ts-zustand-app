import { useState, useEffect, useCallback, useMemo } from 'react'
import { message, notification } from 'antd'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import type { Major, Teacher, Course } from '../constants/course'

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const useScheduleData = () => {
  const location = useLocation()
  const [majors, setMajors] = useState<Major[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedMajor, setSelectedMajor] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedTeacher, setSelectedTeacher] = useState<string>('') // 新增教师筛选
  const [loading, setLoading] = useState(false)

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockMajors: Major[] = [
        {
          id: '1',
          name: '计算机科学与技术',
          classes: [
            {
              id: '1-1',
              name: '计算机科学与技术1班',
              students: [
                { id: '1-1-1', name: '张三', studentNumber: '2023001' },
                { id: '1-1-2', name: '李四', studentNumber: '2023002' },
              ],
            },
            {
              id: '1-2',
              name: '计算机科学与技术2班',
              students: [
                { id: '1-2-1', name: '王五', studentNumber: '2023003' },
                { id: '1-2-2', name: '赵六', studentNumber: '2023004' },
              ],
            },
          ],
        },
        {
          id: '2',
          name: '软件工程',
          classes: [
            {
              id: '2-1',
              name: '软件工程1班',
              students: [
                { id: '2-1-1', name: '钱七', studentNumber: '2023005' },
                { id: '2-1-2', name: '孙八', studentNumber: '2023006' },
              ],
            },
          ],
        },
      ]

      const mockTeachers: Teacher[] = [
        { id: '1', name: '王老师' },
        { id: '2', name: '李老师' },
        { id: '3', name: '张老师' },
        { id: '4', name: '刘老师' },
        { id: '5', name: '陈老师' },
      ]

      const mockCourses: Course[] = [
        {
          id: '1',
          title: '高等数学',
          start: '2026-03-10T08:00:00',
          end: '2026-03-10T09:40:00',
          teacher: '王老师',
          teacherId: '1',
          location: 'A101',
          color: generateRandomColor(),
          status: 'active',
          classId: '1-1',
        },
        {
          id: '2',
          title: '大学英语',
          start: '2026-03-10T10:00:00',
          end: '2026-03-10T11:40:00',
          teacher: '李老师',
          teacherId: '2',
          location: 'B202',
          color: generateRandomColor(),
          status: 'active',
          classId: '1-1',
        },
        {
          id: '3',
          title: '数据结构',
          start: '2026-03-11T14:00:00',
          end: '2026-03-11T15:40:00',
          teacher: '张老师',
          teacherId: '3',
          location: 'C303',
          color: generateRandomColor(),
          status: 'active',
          classId: '1-2',
        },
        {
          id: '4',
          title: '操作系统',
          start: '2026-03-12T08:00:00',
          end: '2026-03-12T09:40:00',
          teacher: '刘老师',
          teacherId: '4',
          location: 'D404',
          color: generateRandomColor(),
          status: 'active',
          classId: '2-1',
        },
        {
          id: '5',
          title: '计算机网络',
          start: '2026-03-12T10:00:00',
          end: '2026-03-12T11:40:00',
          teacher: '陈老师',
          teacherId: '5',
          location: 'E505',
          color: generateRandomColor(),
          status: 'active',
          classId: '2-1',
        },
      ]

      setMajors(mockMajors)
      setTeachers(mockTeachers)
      setCourses(mockCourses)
      setLoading(false)
    }, 500)
  }, [])

  // 从路由状态初始化筛选
  useEffect(() => {
    if (majors.length > 0 && location.state) {
      const { major: majorName, className, student } = location.state as any
      const major = majors.find(m => m.name === majorName)
      if (major) {
        setSelectedMajor(major.id)
        const cls = major.classes.find(c => c.name === className)
        if (cls) {
          setSelectedClass(cls.id)
          if (student) {
            const stu = cls.students.find(s => s.name === student.name)
            if (stu) setSelectedStudent(stu.id)
          }
        }
      }
    }
  }, [majors, location.state])

  // 判断是否为过去日期
  const isPastDate = useCallback((dateStr: string) => {
    return dayjs(dateStr).isBefore(dayjs().startOf('day'), 'day')
  }, [])

  // ==================== 冲突检测 ====================
  const checkConflicts = useCallback(
    (
      start: string,
      end: string,
      teacher: string,
      location: string,
      excludeId?: string
    ): { hasConflict: boolean; message: string } => {
      const otherCourses = excludeId ? courses.filter(c => c.id !== excludeId) : courses

      // 教师冲突
      const teacherConflict = otherCourses.some(
        c =>
          c.teacher === teacher &&
          new Date(c.start) < new Date(end) &&
          new Date(c.end) > new Date(start)
      )
      if (teacherConflict) {
        return { hasConflict: true, message: '该教师在此时间段已有课程' }
      }

      // 地点冲突
      const locationConflict = otherCourses.some(
        c =>
          c.location === location &&
          new Date(c.start) < new Date(end) &&
          new Date(c.end) > new Date(start)
      )
      if (locationConflict) {
        return { hasConflict: true, message: '该教室在此时间段已被占用' }
      }

      return { hasConflict: false, message: '' }
    },
    [courses]
  )

  // ==================== 单课程操作 ====================
  const addCourse = useCallback(
    (values: {
      title: string
      teacher: string
      teacherId?: string
      location: string
      start: string
      end: string
      classId?: string
    }) => {
      // 检查过去日期
      if (isPastDate(values.start) || isPastDate(values.end)) {
        message.error('不能安排过去的课程')
        return false
      }

      // 冲突检测
      const conflict = checkConflicts(values.start, values.end, values.teacher, values.location)
      if (conflict.hasConflict) {
        message.error(conflict.message)
        return false
      }

      const newCourse: Course = {
        ...values,
        id: Date.now().toString(),
        color: generateRandomColor(),
        status: 'pending',
      }
      setCourses(prev => [...prev, newCourse])
      message.success('课程已添加，等待老师确认')
      notification.info({
        message: '通知老师',
        description: `新课程 ${newCourse.title} 已被添加`,
      })
      return true
    },
    [checkConflicts, isPastDate]
  )

  const updateCourse = useCallback(
    (id: string, updates: Partial<Course>) => {
      const course = courses.find(c => c.id === id)
      if (!course) return false

      const newStart = updates.start ?? course.start
      const newEnd = updates.end ?? course.end
      const newTeacher = updates.teacher ?? course.teacher
      const newLocation = updates.location ?? course.location

      // 检查过去日期
      if (isPastDate(newStart) || isPastDate(newEnd)) {
        message.error('不能将课程移到过去的时间')
        return false
      }

      // 冲突检测
      const conflict = checkConflicts(newStart, newEnd, newTeacher, newLocation, id)
      if (conflict.hasConflict) {
        message.error(conflict.message)
        return false
      }

      setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates, status: 'pending' } : c)))
      message.success('课程已修改，等待老师确认')
      notification.info({
        message: '通知老师',
        description: `课程 ${updates.title || course.title} 已被修改`,
      })
      return true
    },
    [courses, checkConflicts, isPastDate]
  )

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id))
    message.success('课程已删除')
  }, [])

  // ==================== 批量操作 ====================
  // 批量偏移（按班级）
  const batchShiftByClass = useCallback(
    (classId: string, days: number): { success: boolean; message: string } => {
      const classCourses = courses.filter(c => c.classId === classId)
      if (classCourses.length === 0) {
        return { success: false, message: '该班级暂无课程' }
      }

      const today = dayjs().startOf('day')
      const updatedCourses: Course[] = []
      const conflicts: string[] = []

      classCourses.forEach(course => {
        const newStart = dayjs(course.start).add(days, 'day')
        const newEnd = dayjs(course.end).add(days, 'day')

        // 跳过周末：如果新日期是周六或周日，调整到下一个周一
        let adjustedStart = newStart
        let adjustedEnd = newEnd
        if (adjustedStart.day() === 6) {
          // 周六
          adjustedStart = adjustedStart.add(2, 'day')
          adjustedEnd = adjustedEnd.add(2, 'day')
        } else if (adjustedStart.day() === 0) {
          // 周日
          adjustedStart = adjustedStart.add(1, 'day')
          adjustedEnd = adjustedEnd.add(1, 'day')
        }

        // 检查是否过去
        if (adjustedStart.isBefore(today)) {
          conflicts.push(`${course.title} 不能移到过去`)
          return
        }

        // 冲突检测
        const conflict = checkConflicts(
          adjustedStart.toISOString(),
          adjustedEnd.toISOString(),
          course.teacher,
          course.location,
          course.id
        )
        if (conflict.hasConflict) {
          conflicts.push(`${course.title}：${conflict.message}`)
          return
        }

        updatedCourses.push({
          ...course,
          start: adjustedStart.toISOString(),
          end: adjustedEnd.toISOString(),
          status: 'pending',
        })
      })

      if (conflicts.length > 0) {
        return { success: false, message: `部分课程无法移动：${conflicts.join('；')}` }
      }

      // 批量更新
      setCourses(prev =>
        prev.map(c => {
          const updated = updatedCourses.find(uc => uc.id === c.id)
          return updated || c
        })
      )

      notification.success({ message: `成功将 ${updatedCourses.length} 门课程后移 ${days} 天` })
      return { success: true, message: '' }
    },
    [courses, checkConflicts]
  )

  // 批量偏移（按教师）
  const batchShiftByTeacher = useCallback(
    (teacherId: string, days: number): { success: boolean; message: string } => {
      const teacherCourses = courses.filter(c => c.teacherId === teacherId)
      if (teacherCourses.length === 0) {
        return { success: false, message: '该教师暂无课程' }
      }

      const today = dayjs().startOf('day')
      const updatedCourses: Course[] = []
      const conflicts: string[] = []

      teacherCourses.forEach(course => {
        const newStart = dayjs(course.start).add(days, 'day')
        const newEnd = dayjs(course.end).add(days, 'day')

        // 跳过周末（同班级逻辑）
        let adjustedStart = newStart
        let adjustedEnd = newEnd
        if (adjustedStart.day() === 6) {
          adjustedStart = adjustedStart.add(2, 'day')
          adjustedEnd = adjustedEnd.add(2, 'day')
        } else if (adjustedStart.day() === 0) {
          adjustedStart = adjustedStart.add(1, 'day')
          adjustedEnd = adjustedEnd.add(1, 'day')
        }

        if (adjustedStart.isBefore(today)) {
          conflicts.push(`${course.title} 不能移到过去`)
          return
        }

        const conflict = checkConflicts(
          adjustedStart.toISOString(),
          adjustedEnd.toISOString(),
          course.teacher,
          course.location,
          course.id
        )
        if (conflict.hasConflict) {
          conflicts.push(`${course.title}：${conflict.message}`)
          return
        }

        updatedCourses.push({
          ...course,
          start: adjustedStart.toISOString(),
          end: adjustedEnd.toISOString(),
          status: 'pending',
        })
      })

      if (conflicts.length > 0) {
        return { success: false, message: `部分课程无法移动：${conflicts.join('；')}` }
      }

      setCourses(prev =>
        prev.map(c => {
          const updated = updatedCourses.find(uc => uc.id === c.id)
          return updated || c
        })
      )

      notification.success({ message: `成功将 ${updatedCourses.length} 门课程后移 ${days} 天` })
      return { success: true, message: '' }
    },
    [courses, checkConflicts]
  )

  // Excel 导入
  const importFromExcel = useCallback(
    async (file: File) => {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet)

      const newCourses: Omit<Course, 'id' | 'color' | 'status'>[] = []
      const errors: string[] = []

      rows.forEach((row: any, index) => {
        // 期望列名：课程名称、教师、教师ID、教室、开始时间、结束时间、班级ID
        const { 课程名称, 教师, 教师ID, 教室, 开始时间, 结束时间, 班级ID } = row

        if (!课程名称 || !教师 || !教室 || !开始时间 || !结束时间 || !班级ID) {
          errors.push(`第 ${index + 2} 行数据不完整`)
          return
        }

        // 解析 Excel 日期（可能为数字或字符串）
        let start: string, end: string
        if (typeof 开始时间 === 'number') {
          start = XLSX.SSF.format('yyyy-mm-dd hh:mm:ss', 开始时间)
        } else {
          start = dayjs(开始时间).format('YYYY-MM-DDTHH:mm:ss')
        }
        if (typeof 结束时间 === 'number') {
          end = XLSX.SSF.format('yyyy-mm-dd hh:mm:ss', 结束时间)
        } else {
          end = dayjs(结束时间).format('YYYY-MM-DDTHH:mm:ss')
        }

        // 检查过去日期
        if (isPastDate(start) || isPastDate(end)) {
          errors.push(`第 ${index + 2} 行：不能安排过去的课程`)
          return
        }

        // 冲突检测
        const conflict = checkConflicts(start, end, 教师, 教室)
        if (conflict.hasConflict) {
          errors.push(`第 ${index + 2} 行：${conflict.message}`)
          return
        }

        newCourses.push({
          title: 课程名称,
          teacher: 教师,
          teacherId: 教师ID,
          location: 教室,
          start,
          end,
          classId: 班级ID,
        })
      })

      if (errors.length > 0) {
        return { success: false, message: `导入失败：${errors.join('；')}` }
      }

      // 批量添加（逐个添加，避免重复提示）
      newCourses.forEach(course => {
        const c: any = { ...course }
        addCourse(c) // 注意 addCourse 有冲突检测，但前面已检测过，这里可跳过，但为了代码复用，保留
      })

      return { success: true, message: `成功导入 ${newCourses.length} 门课程` }
    },
    [addCourse, checkConflicts, isPastDate]
  )

  // Excel 导出
  const exportToExcel = useCallback(
    (filteredCourses?: Course[]) => {
      const data = (filteredCourses || courses).map(c => ({
        课程名称: c.title,
        教师: c.teacher,
        教师ID: c.teacherId,
        教室: c.location,
        开始时间: dayjs(c.start).format('YYYY-MM-DD HH:mm'),
        结束时间: dayjs(c.end).format('YYYY-MM-DD HH:mm'),
        班级ID: c.classId,
      }))
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '课程表')
      XLSX.writeFile(wb, `课程表_${dayjs().format('YYYYMMDD')}.xlsx`)
    },
    [courses]
  )

  // 获取当前选中专业、班级、学生、教师
  const currentMajor = useMemo(
    () => majors.find(m => m.id === selectedMajor),
    [majors, selectedMajor]
  )
  const currentClass = useMemo(
    () => currentMajor?.classes.find(c => c.id === selectedClass),
    [currentMajor, selectedClass]
  )
  const currentStudent = useMemo(
    () => currentClass?.students.find(s => s.id === selectedStudent),
    [currentClass, selectedStudent]
  )
  const currentTeacher = useMemo(
    () => teachers.find(t => t.id === selectedTeacher),
    [teachers, selectedTeacher]
  )

  // 过滤后的课程（用于显示）
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      if (selectedClass && c.classId !== selectedClass) return false
      if (selectedTeacher && c.teacherId !== selectedTeacher) return false
      // 学生筛选比较复杂（需要课程关联学生），暂不实现
      return true
    })
  }, [courses, selectedClass, selectedTeacher])

  return {
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
    setSelectedMajor,
    setSelectedClass,
    setSelectedStudent,
    setSelectedTeacher,
    handleMajorChange: (value: string) => {
      setSelectedMajor(value)
      setSelectedClass('')
      setSelectedStudent('')
    },
    handleClassChange: (value: string) => {
      setSelectedClass(value)
      setSelectedStudent('')
    },
    handleStudentChange: (value: string) => {
      setSelectedStudent(value)
    },
    handleTeacherChange: (value: string) => {
      setSelectedTeacher(value)
    },
    addCourse,
    updateCourse,
    deleteCourse,
    batchShiftByClass,
    batchShiftByTeacher,
    importFromExcel,
    exportToExcel,
  }
}
