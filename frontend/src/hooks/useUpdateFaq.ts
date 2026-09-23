import { useState } from 'react'
import { updateFaq, type Faq, type FaqInput } from '../api/faqs'
import { useTranslation } from 'react-i18next'

export function useUpdateFaq() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitUpdateFaq = async (
    id: number,
    payload: Partial<FaqInput>
  ): Promise<Faq | null> => {
    setLoading(true)
    setError(null)

    try {
      return await updateFaq(id, payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('faq.updateFaqError'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitUpdateFaq, loading, error }
}
