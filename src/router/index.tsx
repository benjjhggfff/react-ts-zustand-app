import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hook' // 你的Redux hooks
import { menuToRoutes } from '../utils/RouterHelper' // 菜单转路由工具
import PrivateRoute from '../components/PrivateRoute' // 权限守卫

// 保留你现有的懒加载组件引用
const Layout = lazy(() => import('../views/Layout/index'))
const LoginPage = lazy(() => import('../views/LoginPage/index'))
const Page404 = lazy(() => import('../common/404'))
const Page500 = lazy(() => import('../common/500'))
const Page403 = lazy(() => import('../common/403'))
const SettingUserInfo = lazy(() => import('../views/userPage/index'))

export default function AppRouter() {
  const { token, menuList } = useAppSelector(state => state.user)
  const authRouter = menuToRoutes(menuList)
  const router = createBrowserRouter([
    // 静态路由
    {
      path: '/login',
      element: <LoginPage />,
    },
    // 动态路由
    {
      path: '/',
      element: (
        <PrivateRoute requiredKey="">
          <Layout />
        </PrivateRoute>
      ),
      children: [
        ...authRouter,
        {
          path: '/setting/userInfo',
          element: <SettingUserInfo />,
        },
        {
          path: '/',
          element: token ? (
            <Navigate to="/setting/userInfo" replace />
          ) : (
            <Navigate to="/login" replace />
          ),
        },
      ],
    },
    { path: '/404', element: <Page404 /> },
    { path: '/500', element: <Page500 /> },
    { path: '/403', element: <Page403 /> },
    // 全局404（兜底）
    { path: '*', element: <Navigate to="/404" replace /> },
  ])

  return <RouterProvider router={router} />
}
