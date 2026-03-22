import React from 'react'
import type { AuthRouteObject, MenuItem, MenuChild } from '../constants/routerPermiss'
import PrivateRoute from '../components/PrivateRoute'

// 懒加载函数：适配你的组件路径
const lazyLoad = (path: string) => {
  // 映射菜单路径到你的组件路径
  const pathMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
    '/resources/classRoom': () => import('../views/classRoom/index'),
    '/stat/classroomUsage': () => import('../views/classroomUsage/index'),
    '/resources/teacher': () => import('../views/teacher/index'),
    '/resources/student': () => import('../views/studentPage/index'),
    '/resources/course': () => import('../views/course/index'),
    '/schedule/edit': () => import('../views/scheduleEdit/index'),
    '/stat/statistics': () => import('../views/scheduleStatistics/index'),
    '/user/userInfo': () => import('../views/userPage/index'),
    '/user/list': () => import('../views/userList/index'),
    '/user/role': () => import('../views/userManagement/index'),

    // 后续新增页面，在这里补充映射
  }
  return React.lazy(pathMap[path] || (() => import('../common/404')))
}

export const menuToRoutes = (menuList: MenuItem[]): AuthRouteObject[] => {
  return menuList.map(menu => {
    return {
      path: menu.path, // 如 '/resources'
      children: menu.children
        .filter(child => !child.hidden)
        .map(child => {
          const PageComponent = lazyLoad(child.path) // 如 '/resources/classRoom'
          return {
            path: child.path.replace(menu.path + '/', ''), // 子路由相对路径：'classRoom'
            element: React.createElement(PrivateRoute, {
              requiredKey: child.key,
              children: React.createElement(PageComponent),
            }),
          }
        }),
    }
  })
}
