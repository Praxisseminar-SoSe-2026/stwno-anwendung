import { useEffect, useState } from 'react'
import { getAnnouncement, type Announcement } from '../api/announcements'

export function useAnnouncement(id: number) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAnnouncement(id)
      .then(setAnnouncement)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [id])

  return { announcement, loading, error, setAnnouncement }
}
