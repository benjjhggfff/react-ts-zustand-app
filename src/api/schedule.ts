import { supabase } from '../service/supabase'

// -------------- 课程表基础 CRUD --------------
// 获取所有课程表
const getSchedules = async () => {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      courses (id, coursename, teacher),
      classrooms (id, classroom_name, code)
    `)
    .order('id')

  if (error) throw error
  return data
}

// 新增课程表
const addSchedule = async (scheduleData: {
  course_id: number
  classroom_id: number
  day_of_week: number
  start_time: string
  end_time: string
  semester: string
  year: number
}) => {
  const { data, error } = await supabase
    .from('schedules')
    .insert([scheduleData])
    .select()
    .single()

  if (error) throw error
  return data
}

// 更新课程表
const updateSchedule = async (id: number, data: any) => {
  const { error } = await supabase
    .from('schedules')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

// 删除课程表
const deleteSchedule = async (id: number) => {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// -------------- 相关数据获取 --------------
// 获取所有课程
const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('id, coursename, teacher')

  if (error) throw error
  return data || []
}

// 获取所有教室
const getClassrooms = async () => {
  const { data, error } = await supabase
    .from('classrooms')
    .select('id, classroom_name, code')

  if (error) throw error
  return data || []
}

// 检查冲突
const checkScheduleConflict = async (
  classroom_id: number,
  day_of_week: number,
  start_time: string,
  end_time: string,
  exclude_id?: number
) => {
  const query = supabase
    .from('schedules')
    .select('id')
    .eq('classroom_id', classroom_id)
    .eq('day_of_week', day_of_week)
    .lt('start_time', end_time)
    .gt('end_time', start_time)

  if (exclude_id) {
    query.neq('id', exclude_id)
  }

  const { data, error } = await query

  if (error) throw error
  return data.length > 0
}

export {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getCourses,
  getClassrooms,
  checkScheduleConflict,
}
