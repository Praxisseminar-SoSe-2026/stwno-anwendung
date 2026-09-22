import { useEffect, useState } from 'react'
import { getFaqs, type Faq } from '../api/faqs.ts'

// Todo: Add authentication

// return list of FAQs with question, answer and category
export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getFaqs()
      .then((data) => setFaqs(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])

  console.log(faqs)

  return { faqs, loading, error }
}
