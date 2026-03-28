import React, { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { useNavigate, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAppSelector } from '../../../hook'
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
import type { MenuItem as AuthMenuItem } from '../../constants/routerPermiss'
import { fetchUserInfo } from '../../store/modules/userStore'
import { useSelector, useDispatch } from 'react-redux'

const { Header, Sider, Content } = Layout
type AntdMenuItem = Required<MenuProps>['items'][number]

const iconMap = {
  AppstoreAddOutlined: <AppstoreAddOutlined />,
  BankOutlined: <BankOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  UserAddOutlined: <UserAddOutlined />,
}

const convertMenuToAntdItems = (menuList: AuthMenuItem[]): AntdMenuItem[] => {
  return menuList.map((menu, index) => {
    const children =
      menu.children?.map(child => ({
        key: child.path,
        label: child.title,
      })) || []

    return {
      key: `parent-${index}`,
      icon: iconMap[menu.icon as keyof typeof iconMap] || <AppstoreAddOutlined />,
      label: menu.title,
      children: children,
    }
  })
}

const SideMenuAnHeader: React.FC = () => {
  const dispatch = useDispatch()
  const { token, userInfo } = useSelector((state: any) => state.user)
  const [collapsed, setCollapsed] = useState(false)
  const { token: antdToken } = theme.useToken()
  const navigate = useNavigate()
  const { menuList } = useAppSelector(state => state.user)
  const menuItems = convertMenuToAntdItems(menuList)
  const windowHight = window.innerHeight
  const minHeight = windowHight - 112

  // ✅ 只拉取用户信息，绝不 return 中断渲染
  useEffect(() => {
    if (token && !userInfo) {
      dispatch(fetchUserInfo() as any)
    }
  }, [token, userInfo, dispatch])

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!key.startsWith('parent-')) {
      navigate(key)
    }
  }

  const defaultSelectedKey = '/user/userInfo'

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

        <Menu
          theme="light"
          mode="inline"
          className="menu"
          onClick={handleMenuClick}
          style={{ background: 'var(--card-bg-color)' }}
          defaultSelectedKeys={[defaultSelectedKey]}
          items={menuItems}
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
            borderRadius: antdToken.borderRadiusLG,
            overflow: 'auto',
          }}
        >
          <ContentBreadcrumb />

          {/* ✅ 只在这里统一等待用户信息，只出现一次 loading */}
          <Suspense fallback={<PageLoading />}>
            {token && !userInfo ? <PageLoading /> : <Outlet />}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}

export default SideMenuAnHeader
