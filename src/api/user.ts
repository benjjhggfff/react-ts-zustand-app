// import Request from '../service/request' // 导入封装的请求实例
import type { LoginParams, LoginResponse, ApiResponse, UserInfo } from '../constants/index'
import { supabase } from '../service/supabase'

// 登录接口
export const loginApi = async (params: LoginParams) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })

  if (error) throw error

  // 获取用户角色信息（从users表）
  const { data: userData } = await supabase
    .from('users')
    .select('role, name')
    .eq('id', data.user.id)
    .single()
  if (!userData) {
    throw new Error('用户信息不存在')
  }
  return {
    code: 200,
    data: {
      token: data.session.access_token,
      user: {
        ...data.user,
        role: userData.role,
        name: userData.name,
      },
    },
  }
}



// 注册接口
export const registerApi = async (params: LoginParams) => {
  console.log('开始注册:', params)
  
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  })

  if (error) {
    console.error('认证注册失败:', error)
    throw error
  }

  console.log('认证注册成功:', data)

  // 临时禁用RLS策略，使用服务端密钥插入用户记录
  // 注意：在生产环境中，应该在后端API中处理这个操作
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: data.user.id,
      role: 'student', // 默认角色为学生
      name: params.email.split('@')[0], // 使用邮箱前缀作为默认名称
    })
    .auth({
      // 这里需要使用服务端密钥
      // 注意：在生产环境中，不应该在前端代码中硬编码服务端密钥
      // 应该在后端API中处理用户创建操作
      headers: {
        'apikey': 'your-service-role-key'
      }
    })

  if (userError) {
    console.error('插入users表失败:', userError)
    throw userError
  }

  console.log('插入users表成功')

  return {
    code: 200,
    data: {
      token: data.session.access_token,
      user: {
        ...data.user,
        role: 'student',
        name: params.email.split('@')[0],
      },
    },
  }
}

// 获取用户信息接口
export const fetchUserInfoApi = async (): Promise<ApiResponse<any>> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('用户未登录')
  
  // 获取用户完整信息
  const { data: userData } = await supabase
    .from('users')
    .select('role, name, phone, real_name, id_card, verified, avatar')
    .eq('id', user.id)
    .single()
  
  if (!userData) throw new Error('用户信息不存在')
  
  // 这里可以根据角色生成菜单和权限
  const { menu, privileges } = getMenuByRole(userData.role)
  
  return {
    code: 200,
    data: {
      user: {
        ...user,
        role: userData.role,
        name: userData.name,
        phone: userData.phone,
        real_name: userData.real_name,
        id_card: userData.id_card,
        verified: userData.verified,
        avatar: userData.avatar,
      },
      permission: {
        privileges: privileges,
        menu: menu,
      },
    },
    msg: 'success',
  }
}

// 修改个人资料接口
export const updateUserProfileApi = async (profileData: {
  name?: string;
  phone?: string;
  real_name?: string;
  id_card?: string;
  avatar?: string;
}): Promise<ApiResponse<UserInfo>> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('用户未登录')
  
  const { error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', user.id)
  
  if (error) throw error
  
  // 重新获取更新后的用户信息
  const { data: updatedUser } = await supabase
    .from('users')
    .select('role, name, phone, real_name, id_card, verified, avatar')
    .eq('id', user.id)
    .single()
  
  if (!updatedUser) throw new Error('用户信息不存在')
  
  return {
    code: 200,
    data: {
      ...user,
      role: updatedUser.role,
      name: updatedUser.name,
      phone: updatedUser.phone,
      real_name: updatedUser.real_name,
      id_card: updatedUser.id_card,
      verified: updatedUser.verified,
      avatar: updatedUser.avatar,
    },
    msg: '更新成功',
  }
}

// 根据角色生成菜单
const getMenuByRole = (role: string) => {
  const baseMenu = [
        {
      path: '/schedule',
      title: '排课管理',
      icon: 'icon-schedule',
      children: [
        { path: '/schedule/edit', title: '排课管理', key: 'scheduleEdit' },
      ],
    },
    {
      path: '/resources',
      title: '资源管理',
      icon: 'icon-resource',
      children: [
        { path: '/resources/classRoom', title: '教室管理', key: 'classroom' },
       
        { path: '/resources/teacher', title: '教师管理', key: 'teacher' },
        { path: '/resources/student', title: '学生管理', key: 'student' },
        { path: '/resources/course', title: '课程管理', key: 'course' },
      ],
    },

    {
      path: '/stat',
      title: '统计分析',
      icon: 'icon-stat',
      children: [
        { path: '/stat/statistics', title: '排课统计', key: 'scheduleStatistics' },
         { path: '/stat/classroomUsage', title: '教室使用统计', key: 'classroomUsage' },
      ],
    },
    {
      path:'/user',
      title:'用户管理',
      icon:'icon-stat',
      children:[
        {path:'/user/userInfo',title:'个人信息',key:'userInfo'}
      ],
    }
    
  ]

  // 根据角色过滤菜单并生成权限列表
  let filteredMenu = baseMenu;
  let privileges: string[] = [];

  if (role === 'admin') {
    // 管理员拥有所有权限
    privileges = baseMenu.flatMap(menu => 
      menu.children?.map(child => child.key) || []
    );
  } else if (role === 'teacher') {
    // 教师只能访问部分资源
    filteredMenu = baseMenu.map((menu) => {
      if (menu.path === '/resources') {
        const filteredChildren = menu.children.filter((child) => ['classroomUsage', 'course'].includes(child.key));
        privileges = [...privileges, ...filteredChildren.map(child => child.key)];
        return {
          ...menu,
          children: filteredChildren,
        };
      }
      return menu;
    });
  } else if (role === 'student') {
    // 学生只能访问教室使用统计
    filteredMenu = baseMenu.map((menu) => {
      if (menu.path === '/resources') {
        const filteredChildren = menu.children.filter((child) => ['classroomUsage'].includes(child.key));
        privileges = [...privileges, ...filteredChildren.map(child => child.key)];
        return {
          ...menu,
          children: filteredChildren,
        };
      } else if (menu.path === '/schedule') {
        return {
          ...menu,
          children: [],
        };
      }
      return menu;
    });
  }

  // 为所有角色添加个人信息权限
  privileges.push('userInfo');

  // 返回菜单和权限
  return { menu: filteredMenu, privileges };
}
