import { useEffect, useState } from 'react'
import { getRequests, type TicketRequest } from '../api/requests'

export function useRequests() {
  const [requests, setRequests] = useState<TicketRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRequests()
      .then(setRequests)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])

  return { requests, loading, error }
}
