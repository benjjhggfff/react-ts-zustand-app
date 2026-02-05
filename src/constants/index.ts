export interface UserInfo {
  baseInfo:{
    userId:string;
    userName:string;
    avatar:string;
    role:number;
    // 部门/学院
    department:string;
  }  
    token:string; 
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}
// 菜单项类型
export interface MenuItem {
  path: string;
  title: string;
  icon: string;
  children: MenuChild[];
}
export interface MenuChild {
  path: string;
  title: string;
  key: string; // 权限标识
  hidden?: boolean;
}

export interface LoginParams{
  userId:string;
  password:string;
}