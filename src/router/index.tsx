import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
const Layout = lazy(() => import('../views/Layout/index'))
const LoginPage = lazy(() => import('../views/LoginPage/index'))
// const ClassRoom = lazy(() => import('../views/classRoom/index'))
const ClassRoom = lazy(() => import('../views/classRoom/index'))
// 创建路由规则
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,
    children: [
      { path: '/', element: <Navigate to="/resources/classRoom" replace /> },
      {
        path: 'resources',
        children: [{ path: 'classRoom', element: <ClassRoom></ClassRoom> }],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>,
  },
])

// 导出路由组件
export default function AppRouter() {
  return <RouterProvider router={router} />
}
