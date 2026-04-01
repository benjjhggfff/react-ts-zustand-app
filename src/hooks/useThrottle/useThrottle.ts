import { useEffect, useRef } from 'react'

function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const throttledFn = (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLast = now - lastTimeRef.current
    if (timeSinceLast >= delay) {
      fn(...args)
      lastTimeRef.current = now
    } else if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        fn(...args)
        timerRef.current = null
      }, delay - timeSinceLast)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  })
  return throttledFn
}

export default useThrottle
