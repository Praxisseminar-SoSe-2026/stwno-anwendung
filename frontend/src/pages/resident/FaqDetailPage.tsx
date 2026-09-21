import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
} from '@mui/material'
import { useFaq } from '../../hooks/useFaq'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { EDITOR_ROLES } from '../../constants/roles.ts'
import { useDeleteFaq } from '../../hooks/useDeleteFaq'
import { useUpdateFaq } from '../../hooks/useUpdateFaq'
import { useFaqCategories } from '../../hooks/useFaqCategories'
import { Loading } from '../../components/Loading'

export function FaqDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { faq, loading, error, setFaq } = useFaq(Number(id))

  const [editing, setEditing] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const [categoryId, setCategoryId] = useState<number | null>(null)

  const canEdit = useHasRole(EDITOR_ROLES)

  const {
    submitDeleteFaq,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteFaq()
  const {
    submitUpdateFaq,
    loading: updateLoading,
    error: updateError,
  } = useUpdateFaq()

  const {
    faqCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFaqCategories()

  const actionLoading = updateLoading || deleteLoading
  const actionError = updateError || deleteError

  const startEditing = () => {
    if (!faq) return
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setCategoryId(faq.category?.id ?? null)
    setEditing(true)
  }

  const handleSave = async () => {
    if (!faq || categoryId === null) return
    const result = await submitUpdateFaq(faq.id, {
      question,
      answer,
      category_id: categoryId,
    })
    if (result) {
      setFaq(result)
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!faq) return
    const result = await submitDeleteFaq(faq.id)
    if (result) {
      navigate('/')
    }
  }

  if (loading) return <Loading />
  if (error) return <Typography color="error">{error}</Typography>
  if (!faq) return null

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Button onClick={() => navigate(-1)}>{t('common.back')}</Button>
      <Stack spacing={2}>
        {editing ? (
          <>
            {/* question */}
            <TextField
              label={t('faq.questionLabel')}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              disabled={actionLoading}
            />
            {/* category */}
            <TextField
              select
              label={t('faq.categoryLabel')}
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              fullWidth
              disabled={actionLoading || categoriesLoading}
            >
              {faqCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {t(`faq.category.${cat.name.toLowerCase()}`)}
                </MenuItem>
              ))}
            </TextField>
            {categoriesError && (
              <Typography color="error">{categoriesError}</Typography>
            )}
            {/* answer */}
            <TextField
              label={t('faq.answerLabel')}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              multiline
              minRows={4}
              fullWidth
              disabled={actionLoading}
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={actionLoading || categoryId === null}
              >
                {actionLoading ? t('common.saving') : t('common.save')}
              </Button>
              <Button
                onClick={() => setEditing(false)}
                disabled={actionLoading}
              >
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
                  disabled={actionLoading}
                >
                  {actionLoading ? t('common.deleting') : t('common.delete')}
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
