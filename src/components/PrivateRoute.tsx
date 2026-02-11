import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hook'
import Page403 from '../common/403' // 你的403组件

interface PrivateRouteProps {
  requiredKey?: string
  children?: React.ReactNode
}

const PrivateRoute = ({ requiredKey, children }: PrivateRouteProps) => {
  const { token, privileges } = useAppSelector(state => state.user)

  // 未登录：跳登录页
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 无需特定权限：渲染子组件/Outlet
  if (!requiredKey) {
    return children || <Outlet />
  }

  // 无权限：跳403页面
  if (!privileges.includes(requiredKey)) {
    return <Navigate to="/403" replace />
  }

  // 有权限：渲染内容
  return children || <Outlet />
}

export default PrivateRoute
