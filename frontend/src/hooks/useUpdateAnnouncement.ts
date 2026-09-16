import { useState } from 'react'
import {
  updateAnnouncement,
  type Announcement,
  type AnnouncementInput,
} from '../api/announcements'
import { useTranslation } from 'react-i18next'

export function useUpdateAnnouncement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitUpdateAnnouncement = async (
    id: number,
    payload: Partial<AnnouncementInput>
  ): Promise<Announcement | null> => {
    setLoading(true)
    setError(null)

    try {
      return await updateAnnouncement(id, payload)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('bulletinBoard.updateAnnouncementError')
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitUpdateAnnouncement, loading, error }
}
