import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
} from '@mui/material'
import { getFaqCategories, type FaqCategory } from '../../api/faqs.ts'
import { useCreateFaq } from '../../hooks/useCreateFaq'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { STAFF_ROLES } from '../../constants/roles.ts'

export function AdminFaqCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<FaqCategory[]>([])
  const { submitFaq, loading, error } = useCreateFaq()

  useEffect(() => {
    getFaqCategories().then(setCategories)
  }, [])

  const canView = useHasRole(STAFF_ROLES)

  if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  const handleSubmit = async () => {
    if (categoryId === null || !question.trim() || !answer.trim()) return

    const result = await submitFaq({
      question,
      answer,
      category_id: categoryId,
    })
    if (result) {
      navigate(`/faq/${result.id}`)
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        {/* question */}
        <TextField
          label={t('faq.questionLabel')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
        />
        {/* category */}
        <TextField
          select
          label={t('faq.categoryLabel')}
          value={categoryId ?? ''}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          fullWidth
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {t(`faq.category.${cat.name.toLowerCase()}`)}
            </MenuItem>
          ))}
        </TextField>
        {/* answer */}
        <TextField
          label={t('faq.answerLabel')}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          multiline
          minRows={4}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              categoryId === null ||
              !question.trim() ||
              !answer.trim()
            }
          >
            {t('common.create')}
          </Button>
          <Button onClick={() => navigate('/faq')} disabled={loading}>
            {t('common.cancel')}
          </Button>
        </Stack>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
