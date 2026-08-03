//const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type FaqCategory =
  | 'general'
  | 'laundry'
  | 'recycling'
  | 'roomBooking'
  | 'moving'
  | 'miscellaneous'

export type Faq = {
  id: string
  question: string
  answer: string
  category: FaqCategory
}

// ToDo: activate API Call with real URL when implemented in backend
/*
// call API Endpoint /faq
export async function getFaqs(lang: string): Promise<Faq[]> {
  try {
    const res = await fetch(`${BASE_URL}/faq?lang=${lang}`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Fetching FAQs failed:', err)
    return []
  }
}
*/

// ToDo: remove placeholder when implemented in backend
export async function getFaqs(lang: string): Promise<Faq[]> {
  if (lang) console.log('ignore')
  return Promise.resolve([
    {
      id: '1',
      question: 'Wo finde ich die Hausordnung?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'general',
    },
    {
      id: '2',
      question: 'An wen wende ich mich bei allgemeinen Fragen?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'general',
    },
    {
      id: '3',
      question: 'Wie bediene ich eine Waschmaschine?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'laundry',
    },
    {
      id: '4',
      question: 'Was mache ich, wenn eine Waschmaschine defekt ist?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'laundry',
    },
    {
      id: '5',
      question: 'Wie trenne ich meinen Müll richtig?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'recycling',
    },
    {
      id: '6',
      question: 'Was ist Bio Müll?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'recycling',
    },
    {
      id: '7',
      question: 'Wie buche ich den Gemeinschaftsraum?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'roomBooking',
    },
    {
      id: '8',
      question: 'Wie lange im Voraus kann ich den Gemeinschaftsraum buchen?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'roomBooking',
    },
    {
      id: '9',
      question: 'Was muss ich beim Auszug beachten?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'moving',
    },
    {
      id: '10',
      question: 'Wann erhalte ich meine Kaution zurück?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'moving',
    },
    {
      id: '11',
      question: 'Wo finde ich verlorene Gegenstände?',
      answer:
        'Lorem ipsum dolor sit amet, test123! consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      category: 'miscellaneous',
    },
  ])
}
