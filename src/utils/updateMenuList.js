// 临时脚本，用于更新localStorage中的菜单列表
const currentMenuList = JSON.parse(localStorage.getItem('menuList') || '[]');
console.log('当前菜单列表:', currentMenuList);

// 检查是否已经存在排课相关的菜单
const scheduleMenu = currentMenuList.find(menu => menu.path === '/schedule');

if (scheduleMenu) {
  // 如果已经存在排课菜单，添加排课统计子菜单
  const hasStatisticsChild = scheduleMenu.children.some(child => child.path === '/schedule/statistics');
  if (!hasStatisticsChild) {
    scheduleMenu.children.push({
      path: '/schedule/statistics',
      title: '排课统计',
      key: 'schedule:statistics'
    });
    localStorage.setItem('menuList', JSON.stringify(currentMenuList));
    console.log('已添加排课统计子菜单');
  } else {
    console.log('排课统计子菜单已存在');
  }
} else {
  // 如果不存在排课菜单，创建排课菜单并添加排课统计子菜单
  currentMenuList.push({
    path: '/schedule',
    title: '排课管理',
    icon: 'schedule',
    children: [
      {
        path: '/schedule/edit',
        title: '手动排课',
        key: 'schedule:edit'
      },
      {
        path: '/schedule/statistics',
        title: '排课统计',
        key: 'schedule:statistics'
      }
    ]
  });
  localStorage.setItem('menuList', JSON.stringify(currentMenuList));
  console.log('已创建排课菜单和排课统计子菜单');
}

console.log('更新后的菜单列表:', JSON.parse(localStorage.getItem('menuList')));
