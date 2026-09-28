import { useEffect, useState } from 'react'
import { getAnnouncements, type Announcement } from '../api/announcements'
import { useAuth } from '../contexts/AuthContext'

const UNRESTRICTED_ROLES = ['admin', 'mitarbeiter']

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, hasRole } = useAuth()

  useEffect(() => {
    getAnnouncements()
      .then((data) => {
        const seesAll = UNRESTRICTED_ROLES.some((role) => hasRole(role))
        console.log('user:', user)
        console.log('seesAll:', seesAll)
        console.log('data:', data)
        const visible = seesAll
          ? data
          : data.filter(
              (a) =>
                a.dormitory_id === null || a.dormitory_id === user?.dormitory_id
            )

        const sorted = [...visible].sort((a, b) => {
          if (a.important !== b.important) {
            return a.important ? -1 : 1
          }
          return (
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
          )
        })
        setAnnouncements(sorted)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [user, hasRole])

  return { announcements, loading, error }
}
