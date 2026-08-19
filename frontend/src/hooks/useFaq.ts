import { useEffect, useState } from 'react'
import { getFaq, type Faq } from '../api/faqs.ts'

// Todo: Add authentication

// return a single faq with question, answer and category
export function useFaq(id: number) {
  const [faq, setFaq] = useState<Faq | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getFaq(id)
      .then(setFaq)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [id])

  return { faq, loading, error, setFaq }
}
