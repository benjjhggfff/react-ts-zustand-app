import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getCache, setCache, isCacheValid } from '../../utils/cacheStorage'
interface UseLocalCacheOptions {
  // 缓存key
  key: string
  // 获取数据的函数
  fetcher: () => Promise<T>
  // 缓存的有效期
  stateTime?: number
  // 是否启用缓存，默认true
  enabled?: boolean
  // 其他的配置
  /** React Query 的其他配置 */
  queryOptions?: Omit<Parameters<typeof useQuery<T>>[1], 'enabled' | 'initialData'>
}
/**
 * 带 localStorage 持久化的 React Query 封装
 * 实现“缓存优先，网络更新”策略
 */
export function useLocalCache<T>({
  key,
  fetcher,
  stateTime = 1000 * 60 * 60 * 24, // 1天
  enabled = true,
  queryOptions = {},
}) {
  // 检查本地缓存是否失效
  const isValid = isCacheValid<T>(key, stateTime)
  // 从缓存中读取数据，如果缓存失效则返回null
  const cacheData = isValid ? getCache<T>(key) : null
  // 使用react query 管理数据，initialData 优先使用缓存数据
  const queryResult = useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const fetchDate = await fetcher()
      setCache(key, fetchDate)
      return fetchDate
    },
    enabled,
    initialData: cacheData ?? undefined,
    staleTime: 0,
    gcTime: stateTime * 2,
    ...queryOptions,
  })
  return queryResult
}
