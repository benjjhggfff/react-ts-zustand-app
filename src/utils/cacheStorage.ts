import type { CacheDate } from '../hooks/useLocalCache/type'

const CACHE_PREFIX = 'app_cache_'
export const getCacheKey = (key: string) => `${CACHE_PREFIX}${key}`

// 从localStore读取缓存的数据

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(getCacheKey(key))
    if (!raw) {
      return null
    }
    const cache: CacheDate<T> = JSON.parse(raw)
    return cache.data
  } catch (error) {
    return null
  }
}

// 写入缓存数据
export function setCache<T>(key: string, data: T): void {
  try {
    const cache: CacheDate<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(getCacheKey(key), JSON.stringify(cache))
  } catch (error) {
    console.warn(`Failed to write cache for key ${key}:`, error)
  }
}

// 检查缓存是否有效
export function isCacheValid<T>(key: string, staleTime: number): boolean {
  try {
    const raw = localStorage.getItem(getCacheKey(key))
    if (!raw) return false
    const cache: CacheDate<T> = JSON.parse(raw)
    return Date.now() - cache.timestamp < staleTime
  } catch (error) {
    return false
  }
}

// 清除指定缓存

export function clearCache(key: string): void {
  localStorage.removeItem(getCacheKey(key))
}

// 清除所有缓存
export function clearAllCache(): void {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}
