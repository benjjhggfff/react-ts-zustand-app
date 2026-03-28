import { createClient } from '@supabase/supabase-js'
import { supabase } from '../service/supabase'

// -------------- 教室基础 CRUD --------------
export const getClassrooms = async () => {
  const { data, error } = await supabase
    .from('classrooms')
    .select(
      `
      *,
      classroom_devices ( devices (id, name) )
    `
    )
    .order('id')

  if (error) throw error
  return data
}

// 新增教室 + 同时添加设备关联
export const addClassroom = async classroomData => {
  const { device_ids, ...classroom } = classroomData

  // 1. 先插入教室
  const { data: newClass } = await supabase.from('classrooms').insert([classroom]).select().single()

  // 2. 如果选了设备，插入关联表
  if (device_ids && device_ids.length > 0) {
    const relations = device_ids.map(device_id => ({
      classroom_id: newClass.id,
      device_id,
    }))

    await supabase.from('classroom_devices').insert(relations)
  }
}

// 更新教室 + 更新设备关联
export const updateClassroom = async (id: number, data: any) => {
  const { device_ids, ...classroomData } = data

  // 1. 更新教室基础信息
  await supabase.from('classrooms').update(classroomData).eq('id', id)

  // 2. 先删除旧设备关联
  await supabase.from('classroom_devices').delete().eq('classroom_id', id)

  // 3. 插入新设备关联（如果有选择）
  if (device_ids && device_ids.length > 0) {
    const relations = device_ids.map((device_id: number) => ({
      classroom_id: id,
      device_id,
    }))
    await supabase.from('classroom_devices').insert(relations)
  }
}

// 删除教室
export const deleteClassroom = async (id: number) => {
  // 先删设备关联
  await supabase.from('classroom_devices').delete().eq('classroom_id', id)

  // 再删教室本身
  const { error } = await supabase.from('classrooms').delete().eq('id', id)

  if (error) throw error
}

// -------------- 预约教室（插入 applications） --------------
// 预约教室
export const applyClassroom = async (applyData: {
  classroom_id: number
  use_date: string
  start_time: string
  end_time: string
  purpose: string
}) => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) throw new Error('请先登录')

  // 1. 插入预约记录
  const { error } = await supabase.from('applications').insert([
    {
      user_id: user.id,
      classroom_id: applyData.classroom_id,
      use_date: applyData.use_date,
      start_time: applyData.start_time,
      end_time: applyData.end_time,
      purpose: applyData.purpose,
      status: 'pending',
    },
  ])

  if (error) throw error

  // 2. 先查当前预约次数
  const { data: currentRoom } = await supabase
    .from('classrooms')
    .select('apply_count')
    .eq('id', applyData.classroom_id)
    .single()

  // 3. 更新次数 +1
  await supabase
    .from('classrooms')
    .update({ apply_count: (currentRoom?.apply_count || 0) + 1 })
    .eq('id', applyData.classroom_id)
}

// 获取教室申请记录
export const getClassroomApplications = async () => {
  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      *,
      classrooms(*),
      profiles(username)
    `
    )
    .order('id', { ascending: false })

  if (error) throw error
  return data
}
