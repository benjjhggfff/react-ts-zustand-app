// mock/user.ts
import { type MockMethod } from 'vite-plugin-mock'
import type { ApiResponse, LoginParams, MenuItem } from '../src/constants/index'
import type { UserInfo } from '../src/store/type'

// 补充接口返回类型定义（贴合 RootState 结构）
type UserInfoResponse = {
  user: UserInfo // 用户基础信息
  permission: {
    privileges: string[]
    menu: MenuItem[]
  }
}

// 模拟排课系统用户数据（严格匹配 RootState 拆解后的结构）
const mockUserList: Record<'admin' | 'normal', UserInfoResponse> = {
  // 管理员：拥有全部排课/资源/统计/用户管理权限
  admin: {
    // 用户基础信息（严格匹配 UserInfo 类型）
    user: {
      userId: '2300330201',
      userName: '系统管理员',
      role: 1, // 1=管理员
      department: '教务处',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    // 权限+菜单
    permission: {
      privileges: [
        'P_SCHEDULE_AUTO',
        'P_SCHEDULE_MANUAL',
        'P_SCHEDULE_PREVIEW',
        'P_RESOURCE_ALL',
        'P_STAT_ALL',
        'P_USER_ALL',
      ],
      menu: [
        {
          path: '/schedule',
          title: '排课操作',
          icon: 'AppstoreAddOutlined',
          children: [
            { path: '/schedule/auto', title: '自动排课', key: 'P_SCHEDULE_AUTO' },
            { path: '/schedule/manual', title: '手动排课', key: 'P_SCHEDULE_MANUAL' },
            { path: '/schedule/preview', title: '预览课表', key: 'P_SCHEDULE_PREVIEW' },
          ],
        },
        {
          path: '/resources',
          title: '资源管理',
          icon: 'BankOutlined',
          children: [
            { path: '/resources/classRoom', title: '教室管理', key: 'P_RESOURCE_CLASSROOM' },
            { path: '/resources/teacher', title: '教师管理', key: 'P_RESOURCE_TEACHER' },
            { path: '/resources/class', title: '班级管理', key: 'P_RESOURCE_CLASS' },
            { path: '/resources/course', title: '课程管理', key: 'P_RESOURCE_COURSE' },
          ],
        },
        {
          path: '/stat',
          title: '数据统计',
          icon: 'BarChartOutlined',
          children: [
            { path: '/stat/schedule', title: '排课统计', key: 'P_STAT_SCHEDULE' },
            { path: '/stat/classroom', title: '教室使用统计', key: 'P_STAT_CLASSROOM' },
            { path: '/stat/teacher', title: '教师使用统计', key: 'P_STAT_TEACHER' },
            { path: '/stat/class', title: '班级使用统计', key: 'P_STAT_CLASS' },
            { path: '/stat/course', title: '课程使用统计', key: 'P_STAT_COURSE' },
          ],
        },
        {
          path: '/user',
          title: '用户管理',
          icon: 'UserAddOutlined',
          children: [
            { path: '/user/list', title: '用户列表', key: 'P_USER_LIST' },
            { path: '/user/role', title: '角色管理', key: 'P_USER_ROLE' },
            { path: '/user/permission', title: '权限管理', key: 'P_USER_PERMISSION' },
          ],
        },
      ],
    },
  },
  // 普通用户：无排课/教师管理/用户管理权限
  normal: {
    // 用户基础信息（严格匹配 UserInfo 类型）
    user: {
      userId: '2300330202',
      userName: '普通用户',
      role: 2, // 2=普通用户
      department: '信息学院',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    // 权限+菜单（仅保留部分资源/统计权限）
    permission: {
      privileges: [
        'P_RESOURCE_CLASSROOM',
        'P_RESOURCE_CLASS',
        'P_RESOURCE_COURSE',
        'P_STAT_CLASSROOM',
        'P_STAT_CLASS',
        'P_STAT_COURSE',
      ],
      menu: [
        {
          path: '/resources',
          title: '资源管理',
          icon: 'BankOutlined',
          children: [
            { path: '/resources/classRoom', title: '教室管理', key: 'P_RESOURCE_CLASSROOM' },
            { path: '/resources/class', title: '班级管理', key: 'P_RESOURCE_CLASS' },
            { path: '/resources/course', title: '课程管理', key: 'P_RESOURCE_COURSE' },
          ],
        },
        {
          path: '/stat',
          title: '数据统计',
          icon: 'BarChartOutlined',
          children: [
            { path: '/stat/classroom', title: '教室使用统计', key: 'P_STAT_CLASSROOM' },
            { path: '/stat/class', title: '班级使用统计', key: 'P_STAT_CLASS' },
            { path: '/stat/course', title: '课程使用统计', key: 'P_STAT_COURSE' },
          ],
        },
      ],
    },
  },
}

export default [
  // 登录接口（POST /api/login）- 强类型约束
  {
    url: '/api/login',
    method: 'post',
    timeout: 500,
    response: ({ body }): ApiResponse<{ token: string }> => {
      const { userId, password } = body as LoginParams

      console.log('[Mock] 登录请求:', { userId, password })

      // 管理员账号：admin/123456
      if (userId === 'admin' && password === '123456') {
        return {
          code: 200,
          msg: '管理员登录成功',
          data: { token: 'schedule-admin-token-123' },
        }
      }

      // 普通用户账号：user/123456
      if (userId === 'user' && password === '123456') {
        return {
          code: 200,
          msg: '普通用户登录成功',
          data: { token: 'schedule-user-token-456' },
        }
      }

      // 账号密码错误
      return {
        code: 401,
        msg: '用户名或密码错误',
        data: null,
      }
    },
  },

  // 获取用户信息接口（GET /api/user/info）- 强类型约束
  {
    url: '/api/user/info',
    method: 'get',
    timeout: 300,
    response: (req): ApiResponse<UserInfoResponse> => {
      const token =
        req.headers?.authorization?.replace('Bearer ', '') || (req.headers?.token as string)

      console.log('[Mock] 获取用户信息，Token:', token)

      // 管理员 Token 验证
      if (token === 'schedule-admin-token-123') {
        return {
          code: 200,
          msg: '获取管理员信息成功',
          data: mockUserList.admin,
        }
      }

      // 普通用户 Token 验证
      if (token === 'schedule-user-token-456') {
        return {
          code: 200,
          msg: '获取普通用户信息成功',
          data: mockUserList.normal,
        }
      }

      // 未登录/Token 无效
      return {
        code: 401,
        msg: '未登录或Token无效，请先登录',
        data: null,
      }
    },
  },

  // 健康检查接口
  {
    url: '/api/health',
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        code: 200,
        msg: 'Mock服务正常运行',
        data: {
          service: 'course-scheduling-system',
          version: '1.0.0',
          timestamp: Date.now(),
        },
      }
    },
  },

  // 退出登录接口
  {
    url: '/api/logout',
    method: 'post',
    timeout: 200,
    response: (): ApiResponse<null> => {
      return {
        code: 200,
        msg: '退出登录成功',
        data: null,
      }
    },
  },
] as MockMethod[]
