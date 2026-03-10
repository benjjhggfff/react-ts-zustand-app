export interface Student {
  id: string
  name: string
  studentNumber: string
}

export interface Class {
  id: string
  name: string
  students: Student[]
}

export interface Major {
  id: string
  name: string
  classes: Class[]
}

export interface Teacher {
  id: string
  name: string
}

export interface Course {
  id: string
  title: string
  start: string
  end: string
  teacher: string
  teacherId?: string // 新增，关联教师ID
  location: string
  color: string
  status: 'active' | 'pending' | 'rejected'
  studentIds?: string[] // 可选，关联学生
  classId?: string // 新增，关联班级ID
  type: 'required' | 'elective' | 'public' | 'major' // 课程类型
  tags: string[] // 自定义标签，如 ['专业课', '第一学期']
}

// 模拟当前用户
export interface User {
  id: string
  name: string
  role: 'admin' | 'teacher' | 'student'
  teacherId?: string
  studentId?: string
  classId?: string
}
