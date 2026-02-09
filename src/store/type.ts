import {type MenuItem} from '../constants/index'
export interface UserInfo {
    userId:string;
    userName:string;
    avatar:string;
    role:number;
    // 部门/学院
    department:string;
}

export interface UserState {
  baseInfo: UserInfo | null;
  token: string;
  loading: boolean;
  error: string | null;
}

export interface PermissionState {
  privileges: string[]; // 权限标识数组
  menu: MenuItem[];
  asyncRoutes: MenuItem[]; // 过滤后的动态路由（菜单结构）
  loading: boolean;
}

export interface RootState {
  user: UserState;
  permission: PermissionState;
  
}