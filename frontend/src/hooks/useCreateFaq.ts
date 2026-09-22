import { useState } from 'react'
import { createFaq, type Faq, type FaqInput } from '../api/faqs'
import { useTranslation } from 'react-i18next'

export function useCreateFaq() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitFaq = async (payload: FaqInput): Promise<Faq | null> => {
    setLoading(true)
    setError(null)

    try {
      return await createFaq(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('faq.createFaqError'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitFaq, loading, error }
}
