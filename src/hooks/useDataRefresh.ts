import { useCallback, useEffect, useState } from 'react'

export function useDataRefresh<T>(fetcher: () => T, deps: unknown[] = []): { data: T; refresh: () => void; loading: boolean } {
  const [data, setData] = useState<T>(fetcher)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(() => {
    setLoading(true)
    setData(fetcher())
    setLoading(false)
  }, [fetcher])

  useEffect(() => {
    refresh()
    const handler = () => refresh()
    window.addEventListener('velora:data-changed', handler)
    return () => window.removeEventListener('velora:data-changed', handler)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, refresh, loading }
}
