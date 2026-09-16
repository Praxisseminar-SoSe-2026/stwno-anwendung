import { useState } from 'react'
import {
  createAnnouncement,
  type Announcement,
  type AnnouncementInput,
} from '../api/announcements'
import { useTranslation } from 'react-i18next'

export function useCreateAnnouncement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitAnnouncement = async (
    payload: AnnouncementInput
  ): Promise<Announcement | null> => {
    setLoading(true)
    setError(null)

    try {
      return await createAnnouncement(payload)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('bulletinBoard.createAnnouncementError')
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitAnnouncement, loading, error }
}
