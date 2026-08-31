import { useEffect, useState } from 'react'

import { getCommunityRooms, type CommunityRoom } from '../api/infrastructure'

export function useCommunityRooms() {
  const [communityRooms, setCommunityRooms] = useState<CommunityRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCommunityRooms()
      .then(setCommunityRooms)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])
  return { communityRooms, loading, error }
}
