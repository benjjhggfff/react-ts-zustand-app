import type { RouteObject } from 'react-router-dom'

export interface MenuItem {
  path: string
  title: string
  icon: string
  children: MenuChild[]
}
export interface MenuChild {
  path: string
  title: string
  key: string // 权限标识
  hidden?: boolean
}
// 扩展路由类型：结合菜单和组件
export type AuthRouteObject = RouteObject & {
  title?: string
  icon?: string
  key?: string
  hidden?: boolean
  children?: AuthRouteObject[]
}
