import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import { useFaqs } from '../../hooks/useFaqs'
import type { Faq } from '../../api/getFaqs'
import { useState } from 'react'

// creates list of all categories with their associated questions
function groupByCategory(faqs: Faq[]): Record<string, Faq[]> {
  return faqs.reduce<Record<string, Faq[]>>((groups, faq) => {
    const group = groups[faq.category] ?? []
    group.push(faq)
    groups[faq.category] = group
    return groups
  }, {})
}

export function FaqPage() {
  const { t } = useTranslation()
  const faqs = useFaqs()

  const [searchTerm, setSearchTerm] = useState('')

  // filters faqs by searchTerm
  const filteredFaqs = faqs.filter((faq) => {
    const term = searchTerm.toLowerCase()
    return (
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term)
    )
  })

  const groupedFaqs = groupByCategory(filteredFaqs)

  return (
    <Stack spacing={10}>
      <Typography variant="h1">{t('faq.title')}</Typography>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('faq.searchPlaceholder')}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          backgroundColor: 'background.paper',
          maxWidth: '30%',
          borderRadius: 1,
        }}
      />

      {/* creates element for every category and their associated questions */}
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <Stack key={category} spacing={1}>
          <Typography variant="h2">{t(`faq.category.${category}`)}</Typography>
          <Stack spacing={1}>
            {categoryFaqs.map((faq) => (
              <Accordion key={faq.id} sx={{ maxWidth: '50%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography color={'primary'}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Stack>
      ))}
      {filteredFaqs.length === 0 && (
        <Typography color="error">{t('faq.noSearchResults')}</Typography>
      )}
    </Stack>
  )
}
