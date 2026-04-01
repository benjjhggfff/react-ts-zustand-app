export interface CacheOptions<T> {
  // 缓存有效期
  staleTime?: number
  // 是否启用缓存，默认true
  enabled?: boolean
  // 获取数据的异步函数
  fetcher: () => Promise<T>
}

export interface CacheDate<T> {
  data: T
  // 缓存时间戳
  timestamp: number
}
