import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { useNavigate, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAppSelector } from '../../../hook' // 导入Redux hooks
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
import type { MenuItem as AuthMenuItem } from '../../constants/routerPermiss' // 导入你的菜单类型

const { Header, Sider, Content } = Layout

// 定义antd Menu需要的Item类型
type AntdMenuItem = Required<MenuProps>['items'][number]

// 图标映射：把mock里的icon字符串转成实际的antd图标组件
const iconMap = {
  AppstoreAddOutlined: <AppstoreAddOutlined />,
  BankOutlined: <BankOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  UserAddOutlined: <UserAddOutlined />,
}

// 核心函数：把Redux中的menuList转换成antd Menu需要的格式
const convertMenuToAntdItems = (menuList: AuthMenuItem[]): AntdMenuItem[] => {
  return menuList.map((menu, index) => {
    // 处理子菜单
    const children =
      menu.children?.map(child => ({
        key: child.path, // 子菜单key=路径，用于跳转
        label: child.title, // 子菜单显示文本
      })) || []

    return {
      key: `parent-${index}`, // 父菜单key（自定义）
      icon: iconMap[menu.icon as keyof typeof iconMap] || <AppstoreAddOutlined />, // 映射图标
      label: menu.title, // 父菜单显示文本
      children: children, // 子菜单列表
    }
  })
}

const SideMenuAnHeader: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const navigate = useNavigate()
  // 核心：从Redux获取动态菜单列表（登录后mock返回的menuList）
  const { menuList } = useAppSelector(state => state.user)
  // 动态生成antd菜单
  const menuItems = convertMenuToAntdItems(menuList)

  // 获取页面高度
  const windowHight = window.innerHeight
  const minHeight = windowHight - 112

  // 处理菜单点击跳转（保留原有逻辑）
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!key.startsWith('parent-')) {
      // 只处理子菜单点击
      navigate(key)
    }
  }

  // 动态默认选中项：取第一个有效子菜单路径（替代原有的静态 '/resources/classRoom'）
  const defaultSelectedKey = menuList[0]?.children?.[0]?.path || '/resources/classRoom'

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: 'var(--card-bg-color)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 100,
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

        {/* 关键修改：使用动态menuItems和动态默认选中项 */}
        <Menu
          theme="light"
          mode="inline"
          className="menu"
          onClick={handleMenuClick}
          style={{ background: 'var(--card-bg-color)' }}
          defaultSelectedKeys={[defaultSelectedKey]} // 动态默认选中
          items={menuItems} // 动态菜单列表
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header className={styles.header}></Header>

        <Content
          className={styles.content}
          style={{
            margin: '8px 8px',
            padding: 4,
            minHeight: minHeight,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
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
