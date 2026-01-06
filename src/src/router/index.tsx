import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import LoginPage from '../views/LoginPage';


// 创建路由规则
const router = createBrowserRouter([
   {
     path: '/',
     element: <LoginPage></LoginPage>
   }
]);

// 导出路由组件
export default function AppRouter() {
  return <RouterProvider router={router} />;
}