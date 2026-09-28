import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import { useFaqs } from '../../hooks/useFaqs'
import type { Faq } from '../../api/faqs.ts'
import { useState } from 'react'
import { Link } from 'react-router'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { STAFF_ROLES } from '../../constants/roles.ts'
import { Loading } from '../../components/Loading'

// creates list of all categories with their associated questions
function groupByCategory(faqs: Faq[]): Record<string, Faq[]> {
  return faqs.reduce<Record<string, Faq[]>>((groups, faq) => {
    const group = groups[faq.category.name] ?? []
    group.push(faq)
    groups[faq.category.name] = group
    return groups
  }, {})
}

export function FaqPage() {
  const { t } = useTranslation()
  const { faqs, loading, error } = useFaqs()

  const [searchTerm, setSearchTerm] = useState('')

  // filters faqs by searchTerm
  const filteredFaqs = faqs.filter((faq) => {
    const term = searchTerm.toLowerCase()
    return (
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term)
    )
  })

  const canEdit = useHasRole(STAFF_ROLES)

  const groupedFaqs = groupByCategory(filteredFaqs)

  if (loading) return <Loading />
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Stack
      spacing={3}
      sx={{ width: { xs: '100%', md: '50%' }, alignSelf: 'center' }}
    >
      <Typography variant="h1">{t('faq.title')}</Typography>
      <Divider />
      {/* Searchbar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
            width: { xs: '100%', sm: '50%' },
            borderRadius: 1,
          }}
        />
        {canEdit && (
          <Button component={Link} variant="contained" to="/faq/neu">
            +
          </Button>
        )}
      </Stack>

      <Stack spacing={5}>
        {/* creates element for every category and their associated questions */}
        {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <Stack key={category} spacing={3}>
            <Typography variant="h2">
              {t(`faq.category.${category.toLowerCase()}`)}
            </Typography>
            <Stack spacing={2}>
              {categoryFaqs.map((faq) => (
                <Accordion key={faq.id} sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: 'center', width: '100%', pr: 1 }}
                    >
                      <Typography
                        color={'primary'}
                        lang="de"
                        sx={{
                          flexGrow: 1,
                          hyphens: 'auto',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {faq.question}
                      </Typography>
                      <Link
                        to={`/faq/${faq.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canEdit && (
                          <Button component="span">{t('common.edit')}</Button>
                        )}
                      </Link>
                    </Stack>
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
    </Stack>
  )
}
