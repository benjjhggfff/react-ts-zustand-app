import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { useNavigate, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ContentBreadcrumb from './Breadcrumb'
const PageLoading = lazy(() => import('../../components/loading'))
import {
  BarChartOutlined,
  BankOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import LogoSvg from '../../components/LogoSVg'
import styles from './layout.module.scss'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const SideMenuAnHeader: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const navigate = useNavigate()

  // 获取页面高度
  const windowHight = window.innerHeight
  const minHeight = windowHight - 112

  const menuItems: MenuItem[] = [
    {
      key: 'parent-0',
      icon: <AppstoreAddOutlined />,
      label: '排课操作',
      children: [
        { key: '/schedule/auto', label: '自动排课' },
        { key: '/schedule/manual', label: '手动排课' },
        { key: '/schedule/preview', label: '预览课表' },
      ],
    },
    {
      key: 'parent-1',
      icon: <BankOutlined />,
      label: '资源管理',
      children: [
        { key: '/resources/classRoom', label: '教室管理' },
        { key: '/resources/teacher', label: '教师管理' },
        { key: '/resources/class', label: '班级管理' },
        { key: '/resources/course', label: '课程管理' },
      ],
    },
    {
      key: 'parent-2',
      icon: <BarChartOutlined />,
      label: '数据统计',
      children: [
        { key: '/stat/schedule', label: '排课统计' },
        { key: '/stat/classroom', label: '教室使用统计' },
        { key: '/stat/teacher', label: '教师使用统计' },
        { key: '/stat/class', label: '班级使用统计' },
        { key: '/stat/course', label: '课程使用统计' },
      ],
    },
    {
      key: 'parent-3',
      icon: <UserAddOutlined />,
      label: '用户管理',
      children: [
        { key: '/user/list', label: '用户列表' },
        { key: '/user/role', label: '角色管理' },
        { key: '/user/permission', label: '权限管理' },
      ],
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!key.startsWith('parent-')) {
      navigate(key)
    }
  }

  return (
    <Layout style={{ height: '100vh' }}> {/* 关键：设置整个布局高度为视口高度 */}
      {/* 修复1：给Sider设置固定定位，让整个侧边栏固定 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ 
          background: 'var(--card-bg-color)',
          position: 'fixed', // 固定侧边栏
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh', // 高度占满视口
          zIndex: 100 // 确保侧边栏在最上层
        }}
      >
        <div className={styles.logo}>
          <LogoSvg />
          <h1
            className={`${styles.logoTextActive} ${!collapsed ? styles.logoTextActive : styles.logoTextInactive}`}
          >
            智管有方
          </h1>
        </div>

        {/* 修复2：移除Menu的fixed定位，恢复正常文档流 */}
        <Menu
          theme="light"
          mode="inline"
          className="menu"
          onClick={handleMenuClick}
          style={{ background: 'var(--card-bg-color)' }}
          defaultSelectedKeys={['/resources/classRoom']}
          items={menuItems}
        />
      </Sider>

      {/* 修复3：给内容区设置左侧内边距，避免被固定的侧边栏遮挡 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header className={styles.header}></Header>

        <Content
          className={styles.content}
          style={{
            margin: '8px 8px',
            padding: 4,
            minHeight: minHeight,
            borderRadius: borderRadiusLG,
            overflow: 'auto' // 内容区单独滚动，不影响侧边栏
          }}
        >
          <ContentBreadcrumb />
          <Suspense fallback={<PageLoading></PageLoading>}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}

export default SideMenuAnHeader