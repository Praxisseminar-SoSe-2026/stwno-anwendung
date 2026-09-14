import { useCallback, useEffect, useState } from 'react'
import { getRequestById, type TicketRequest } from '../api/requests'

export function useRequest(id: number) {
  const [request, setRequest] = useState<TicketRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRequestById(id)
      .then(setRequest)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [id])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    return getRequestById(id)
      .then(setRequest)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [id])

  return { request, loading, error, refetch, setRequest }
}
