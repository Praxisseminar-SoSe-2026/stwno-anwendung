import { useEffect, useState } from 'react'
import { getFaqs, type Faq } from '../api/getFaqs'
import { useTranslation } from 'react-i18next'

// return list of FAQs with question, answer and category
export function useFaqs() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [faqs, setFaqs] = useState<Faq[]>([])

  useEffect(() => {
    getFaqs(lang).then((faqs) => setFaqs(faqs))
  }, [lang])

  return faqs
}
