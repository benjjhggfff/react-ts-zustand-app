import Request from '../service/request' // 导入封装的请求实例

// 获取教室列表
export const getClassroomsApi = (params?: any): Promise<any> => {
  return Request.get({ url: '/classrooms', params })
}

// 获取教室使用记录
export const getUsageRecordsApi = (params?: any): Promise<any> => {
  return Request.get({ url: '/usage-records', params })
}

// 获取教室申请记录
export const getApplicationRecordsApi = (params?: any): Promise<any> => {
  return Request.get({ url: '/application-records', params })
}

// 提交教室申请
export const submitApplicationApi = (data: any): Promise<any> => {
  return Request.post({ url: '/applications', data })
}

// 审批教室申请
export const approveApplicationApi = (id: string, data: any): Promise<any> => {
  return Request.put({ url: `/applications/${id}/approve`, data })
}

// 获取统计数据
export const getStatisticsApi = (params?: any): Promise<any> => {
  return Request.get({ url: '/classroom-statistics', params })
}

// 获取图表数据
export const getChartDataApi = (params?: any): Promise<any> => {
  return Request.get({ url: '/classroom-charts', params })
}
