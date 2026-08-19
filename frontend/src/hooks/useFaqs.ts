import { useEffect, useState } from 'react'
import { getFaqs, type Faq } from '../api/faqs.ts'

// Todo: Add authentication

// return list of FAQs with question, answer and category
export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([])

  useEffect(() => {
    getFaqs().then((data) => setFaqs(data))
  }, [])

  console.log(faqs)

  return faqs
}
