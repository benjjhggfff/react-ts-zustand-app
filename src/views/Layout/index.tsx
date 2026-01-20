import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import {

  BarChartOutlined,
  BankOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import LogoSvg from '../../components/LogoSVg';
import styles from './layout.module.scss';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const SideMenuAnHeader: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const navigate = useNavigate();

  // 获取页面高度
  const windowHight = window.innerHeight;
  const minHeight = windowHight - 112;


const menuItems: MenuItem[] = [
  {
    key: 'parent-0',
    icon: <AppstoreAddOutlined />,
    label: '排课操作',
    children: [
      // 排课操作：统一为 /schedule/xxx 层级格式（和其他模块对齐）
      { key: '/schedule/auto', label: '自动排课' },
      { key: '/schedule/manual', label: '手动排课' },
      { key: '/schedule/preview', label: '预览课表' }
    ]
  },
  {
    key: 'parent-1',
    icon: <BankOutlined />,
    label: '资源管理',
    children: [
      { key: '/resources/classroom', label: '教室管理' },
      { key: '/resources/teacher', label: '教师管理' },
      { key: '/resources/class', label: '班级管理' },
      { key: '/resources/course', label: '课程管理' }
    ]
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
      { key: '/stat/course', label: '课程使用统计' }
    ]
  },
  {
    key: 'parent-3',
    icon: <UserAddOutlined />,
    label: '用户管理',
    children: [
      { key: '/user/list', label: '用户列表' },
      { key: '/user/role', label: '角色管理' },
      { key: '/user/permission', label: '权限管理' }
    ]
  }
];


  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    // 过滤父菜单（parent-开头的key不跳转），只处理子菜单
    if (!key.startsWith('parent-')) {
      navigate(key); // 跳转到对应路由路径
    }
  };

  return (
    <Layout>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ background: 'var(--card-bg-color)' }} 
      >
        <div className={styles.logo}> 
          <LogoSvg />
          <h1 className={`${styles.logoTextActive} ${!collapsed ? styles.logoTextActive : styles.logoTextInactive}`}> 智管有方</h1>
        </div>
       
        <Menu
          theme="light"
          mode="inline"
          className='menu'
          // 正确绑定onClick事件（直接传函数，AntD自动传事件对象）
          onClick={handleMenuClick}
          style={{ background: 'var(--card-bg-color)' }} 
          defaultSelectedKeys={['/classRoom']}
        
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background:'var(--card-bg-color)',position:'sticky',top:0,zIndex:1,width:'100%' }}>

        </Header>
        <Content
          style={{
            margin: '8px 8px',
            padding: 4,
            minHeight: minHeight,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideMenuAnHeader;