import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
} from '@mui/material'
import { useFaq } from '../../hooks/useFaq'
import {
  updateFaq,
  deleteFaq,
  getFaqCategories,
  type FaqCategory,
} from '../../api/faqs'
import {useHasRole} from "../../hooks/useHasRole.ts";
import {EDITOR_ROLES} from "../../constants/roles.ts";

export function FaqDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { faq, loading, error, setFaq } = useFaq(Number(id))

  const [editing, setEditing] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<FaqCategory[]>([])

  const canEdit = useHasRole(EDITOR_ROLES)

  useEffect(() => {
    getFaqCategories().then(setCategories)
  }, [])

  const startEditing = () => {
    if (!faq) return
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setCategoryId(faq.category?.id ?? null)
    setEditing(true)
  }

  const handleSave = async () => {
    if (!faq || categoryId === null) return
    setSaving(true)
    setActionError(null)
    try {
      const updated = await updateFaq(faq.id, {
        question,
        answer,
        category_id: categoryId,
      })
      setFaq(updated)
      setEditing(false)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!faq) return
    setSaving(true)
    setActionError(null)
    try {
      await deleteFaq(faq.id)
      navigate('/faq')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed')
      setSaving(false)
    }
  }

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error}</Typography>
  if (!faq) return null

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        {editing ? (
          <>
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
                disabled={saving || categoryId === null}
              >
                {t('common.save')}
              </Button>
              <Button onClick={() => setEditing(false)} disabled={saving}>
                {t('common.cancel')}
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h4">{faq.question}</Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {faq.answer}
            </Typography>
            {canEdit && (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={startEditing}>
                {t('common.edit')}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={saving}
              >
                {t('common.delete')}
              </Button>
            </Stack>
            )}
          </>
        )}

        {actionError && <Typography color="error">{actionError}</Typography>}
      </Stack>
    </Paper>
  )
}
