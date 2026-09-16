import { useState } from 'react'
import { deleteAnnouncement } from '../api/announcements'
import { useTranslation } from 'react-i18next'

export function useDeleteAnnouncement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitDeleteAnnouncement = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      await deleteAnnouncement(id)
      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('bulletinBoard.deleteAnnouncementError')
      )
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submitDeleteAnnouncement, loading, error }
}
