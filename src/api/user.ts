// src/api/user.ts
import Request from '../service/request'; // 导入封装的请求实例
import { type ApiResponse,type  LoginParams,type UserInfo ,type MenuItem} from '../constants/index';

export const loginApi = async (params: LoginParams): Promise<string> => {
  // 用Request.post，泛型指定返回值类型
  const res = await Request.post<ApiResponse<{ token: string }>>({
    url: '/login',
    data: params, // POST参数
  });

  if (res.code !== 200) throw new Error(res.msg);
  return res.data.token;
};


export const fetchUserInfoApi = async (): Promise<
  ApiResponse<{ user: UserInfo; privileges: string[]; menu: MenuItem[] }>
> => {

  return Request.get<ApiResponse>({ url: '/user/info' });
};