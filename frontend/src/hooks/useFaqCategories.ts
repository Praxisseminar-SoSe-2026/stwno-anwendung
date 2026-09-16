import { useEffect, useState } from 'react'
import { getFaqCategories, type FaqCategory } from '../api/faqs'

export function useFaqCategories() {
  const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getFaqCategories()
      .then(setFaqCategories)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])

  return { faqCategories, loading, error }
}
