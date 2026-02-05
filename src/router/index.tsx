import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
const Layout = lazy(() => import('../views/Layout/index'))
const LoginPage = lazy(() => import('../views/LoginPage/index'))
const Page404 = lazy(() => import('../common/404'))
const Page500 = lazy(() => import('../common/500'))
const Page403 = lazy(() => import('../common/403'))
// const ClassRoom = lazy(() => import('../views/classRoom/index'))
const ClassRoom = lazy(() => import('../views/classRoom/index'))
const Teacher = lazy(() => import('../views/teacher/index'))
const Student = lazy(() => import('../views/studentPage/index'))
// 创建路由规则
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,
    children: [
      { path: '/', element: <Navigate to="/resources/classRoom" replace /> },
      {
        path: 'resources',
        name: 'resources',
        meta:{
          title:'资源管理',
          icon:'resources'
        }
        children: [
          { path: 'classRoom', element: <ClassRoom></ClassRoom> },
          { path: 'teacher', element: <Teacher></Teacher>},
          {
            path: 'student', element: <Student></Student>
          }
        ],
      },
      
    ],
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>,
  },
  {
    path:'/404',
    element: <Page404></Page404>
  },{
    path:'/500',
    element: <Page500></Page500>
  },
  {
    path:'/403',
    element: <Page403></Page403>
  }
])

// 导出路由组件
export default function AppRouter() {
  return <RouterProvider router={router} />
}
