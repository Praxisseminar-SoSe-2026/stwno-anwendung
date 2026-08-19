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
import { createFaq, getFaqCategories, type FaqCategory } from '../../api/faqs'

// Todo: Add Authentification

export function FaqCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<FaqCategory[]>([])

  useEffect(() => {
    getFaqCategories().then(setCategories)
  }, [])

  const handleSave = async () => {
    if (categoryId === null || !question.trim() || !answer.trim()) return
    setSaving(true)
    setActionError(null)
    try {
      const created = await createFaq({
        question,
        answer,
        category_id: categoryId,
      })
      navigate(`/faq/${created.id}`)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
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
            onClick={handleSave}
            disabled={
              saving ||
              categoryId === null ||
              !question.trim() ||
              !answer.trim()
            }
          >
            {t('common.create')}
          </Button>
          <Button onClick={() => navigate('/faq')} disabled={saving}>
            {t('common.cancel')}
          </Button>
        </Stack>

        {actionError && <Typography color="error">{actionError}</Typography>}
      </Stack>
    </Paper>
  )
}
