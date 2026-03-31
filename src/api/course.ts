import { supabase } from '../service/supabase'

// 课程接口（和你的页面 100% 匹配）
export interface Course {
  id: number
  coursenumber: string
  coursename: string
  coursecategories: string
  courseproperties: string
  coursetype: string
  coursenature: string
  englishname: string
  department: string
  enabledstatus: string | null
  credithours: string
  theoreticalhours: string
  experimentalhours: string
  computerbasedhours: string | null
  practicalhours: string
  otherhours: string
  credits: string
  weeklyhours: string
  purelypractical: string
  create_time: string
  teacher: string
  coursedescription: string
}

// 获取所有课程
export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data as Course[]
}

// 新增课程
export const addCourse = async (courseData: Omit<Course, 'id'>) => {
  const { data, error } = await supabase.from('courses').insert([courseData]).select()

  if (error) throw error
  return data
}

// 更新课程
export const updateCourse = async (id: number, courseData: Partial<Course>) => {
  const { data, error } = await supabase.from('courses').update(courseData).eq('id', id).select()

  if (error) throw error
  return data
}

// 删除课程
export const deleteCourse = async (id: number) => {
  const { error } = await supabase.from('courses').delete().eq('id', id)

  if (error) throw error
  return true
}
