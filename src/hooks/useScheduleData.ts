import { useState, useEffect, useCallback, useMemo } from 'react'
import { message, notification } from 'antd'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import type { Major, Teacher, Course, User } from '../constants/course'

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 模拟当前用户（通过修改此对象切换角色）
const MOCK_CURRENT_USER: User = {
  id: '1',
  name: '管理员',
  role: 'admin', // 可选 'admin', 'teacher', 'student'
  // 如果是教师，可设置 teacherId: '1'
  // 如果是学生，可设置 studentId: '1', classId: '1-1'
}

export const useScheduleData = () => {
  const location = useLocation()
  const [majors, setMajors] = useState<Major[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  // 当前用户（模拟）
  const [currentUser] = useState<User>(MOCK_CURRENT_USER)

  // 筛选状态
  const [selectedMajor, setSelectedMajor] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // 历史版本栈
  const [history, setHistory] = useState<Course[][]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  // 保存当前快照到历史（每次修改前调用）
  const pushHistory = useCallback(() => {
    setHistory(prev => {
      // 保留当前索引之前的版本，丢弃之后的（如果有）
      const newHistory = prev.slice(0, historyIndex + 1)
      // 深拷贝当前课程列表
      newHistory.push(JSON.parse(JSON.stringify(courses)))
      return newHistory
    })
    setHistoryIndex(prev => prev + 1)
  }, [courses, historyIndex])

  // 撤销最后一次操作
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setCourses(history[historyIndex - 1])
      setHistoryIndex(historyIndex - 1)
      message.success('撤销成功')
    } else {
      message.warning('没有可撤销的操作')
    }
  }, [history, historyIndex])

  // 回滚到指定历史版本
  const rollbackToHistory = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        setCourses(history[index])
        setHistoryIndex(index)
        message.success('已恢复到所选版本')
      }
    },
    [history]
  )

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
          type: 'required',
          tags: ['专业课', '第一学期'],
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
          type: 'required',
          tags: ['公共课'],
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
          type: 'major',
          tags: ['专业课', '核心'],
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
          type: 'major',
          tags: ['专业课'],
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
          type: 'elective',
          tags: ['选修课'],
        },
      ]

      setMajors(mockMajors)
      setTeachers(mockTeachers)
      setCourses(mockCourses)
      // 初始化历史栈，将初始状态作为第一个版本
      setHistory([JSON.parse(JSON.stringify(mockCourses))])
      setHistoryIndex(0)
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

  // 根据用户角色过滤课程
  const filteredCoursesByRole = useMemo(() => {
    if (currentUser.role === 'admin') {
      return courses
    } else if (currentUser.role === 'teacher') {
      return courses.filter(c => c.teacherId === currentUser.teacherId)
    } else if (currentUser.role === 'student') {
      // 学生看自己班级的课程 + 公共课
      return courses.filter(c => c.classId === currentUser.classId || c.type === 'public')
    }
    return courses
  }, [courses, currentUser])

  // 根据筛选条件进一步过滤（班级、教师等）
  const filteredCourses = useMemo(() => {
    return filteredCoursesByRole.filter(c => {
      if (selectedClass && c.classId !== selectedClass) return false
      if (selectedTeacher && c.teacherId !== selectedTeacher) return false
      // 学生维度筛选暂时忽略，可后续扩展
      return true
    })
  }, [filteredCoursesByRole, selectedClass, selectedTeacher])

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
      type: 'required' | 'elective' | 'public' | 'major'
      tags: string[]
    }) => {
      // 保存历史
      pushHistory()

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
    [checkConflicts, isPastDate, pushHistory]
  )

  const updateCourse = useCallback(
    (id: string, updates: Partial<Course>) => {
      const course = courses.find(c => c.id === id)
      if (!course) return false

      // 保存历史
      pushHistory()

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
    [courses, checkConflicts, isPastDate, pushHistory]
  )

  const deleteCourse = useCallback(
    (id: string) => {
      // 保存历史
      pushHistory()
      setCourses(prev => prev.filter(c => c.id !== id))
      message.success('课程已删除')
    },
    [pushHistory]
  )

  // ==================== 批量操作 ====================
  // 批量偏移（按班级）
  const batchShiftByClass = useCallback(
    (classId: string, days: number): { success: boolean; message: string } => {
      const classCourses = courses.filter(c => c.classId === classId)
      if (classCourses.length === 0) {
        return { success: false, message: '该班级暂无课程' }
      }

      // 保存历史
      pushHistory()

      const today = dayjs().startOf('day')
      const updatedCourses: Course[] = []
      const conflicts: string[] = []

      classCourses.forEach(course => {
        const newStart = dayjs(course.start).add(days, 'day')
        const newEnd = dayjs(course.end).add(days, 'day')

        // 跳过周末
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
    [courses, checkConflicts, pushHistory]
  )

  // 批量偏移（按教师）
  const batchShiftByTeacher = useCallback(
    (teacherId: string, days: number): { success: boolean; message: string } => {
      const teacherCourses = courses.filter(c => c.teacherId === teacherId)
      if (teacherCourses.length === 0) {
        return { success: false, message: '该教师暂无课程' }
      }

      pushHistory()

      const today = dayjs().startOf('day')
      const updatedCourses: Course[] = []
      const conflicts: string[] = []

      teacherCourses.forEach(course => {
        const newStart = dayjs(course.start).add(days, 'day')
        const newEnd = dayjs(course.end).add(days, 'day')

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
    [courses, checkConflicts, pushHistory]
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
        const { 课程名称, 教师, 教师ID, 教室, 开始时间, 结束时间, 班级ID, 课程类型, 标签 } = row

        if (!课程名称 || !教师 || !教室 || !开始时间 || !结束时间 || !班级ID || !课程类型) {
          errors.push(`第 ${index + 2} 行数据不完整`)
          return
        }

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

        if (isPastDate(start) || isPastDate(end)) {
          errors.push(`第 ${index + 2} 行：不能安排过去的课程`)
          return
        }

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
          type: 课程类型, // required,elective,public,major
          tags: 标签 ? 标签.split(',').map((t: string) => t.trim()) : [],
        })
      })

      if (errors.length > 0) {
        return { success: false, message: `导入失败：${errors.join('；')}` }
      }

      // 保存历史
      pushHistory()

      // 批量添加
      newCourses.forEach(course => {
        const c: any = { ...course }
        // 直接 setCourses 而不是调用 addCourse，避免多次历史保存
        setCourses(prev => [
          ...prev,
          {
            ...c,
            id: Date.now() + Math.random().toString(),
            color: generateRandomColor(),
            status: 'pending',
          },
        ])
      })

      return { success: true, message: `成功导入 ${newCourses.length} 门课程` }
    },
    [checkConflicts, isPastDate, pushHistory]
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
        课程类型: c.type,
        标签: c.tags.join(','),
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

  // 课程类型选项（用于表单）
  const courseTypeOptions = [
    { label: '必修', value: 'required' },
    { label: '选修', value: 'elective' },
    { label: '公共课', value: 'public' },
    { label: '专业课', value: 'major' },
  ]

  return {
    // 数据
    majors,
    teachers,
    courses,
    filteredCourses,
    loading,
    currentUser,
    // 筛选值
    selectedMajor,
    selectedClass,
    selectedStudent,
    selectedTeacher,
    currentMajor,
    currentClass,
    currentStudent,
    currentTeacher,
    // 筛选变更
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
    // 课程操作
    addCourse,
    updateCourse,
    deleteCourse,
    // 批量操作
    batchShiftByClass,
    batchShiftByTeacher,
    importFromExcel,
    exportToExcel,
    // 历史版本
    history,
    historyIndex,
    undo,
    rollbackToHistory,
    pushHistory,
    // 课程类型选项
    courseTypeOptions,
  }
}
