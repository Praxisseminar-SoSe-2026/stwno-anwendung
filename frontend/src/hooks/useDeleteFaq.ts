import { useState } from 'react'
import { deleteFaq } from '../api/faqs'
import { useTranslation } from 'react-i18next'

export function useDeleteFaq() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitDeleteFaq = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      await deleteFaq(id)
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('bulletinBoard.deleteFaqError')
      )
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submitDeleteFaq, loading, error }
}
