import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { createAnnouncement } from '../../api/announcements'

export function AdminCreateAnnouncementPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [important, setImportant] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const created = await createAnnouncement({ title, text, important })
      navigate(`/aushang/${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
      setSaving(false)
    }
  }

  /* TODO: Add the possibility to create the announcement for a specific dormitory */
  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{t('bulletinBoard.createAnnouncement')}</Typography>

        <TextField
          label={t('bulletinBoard.titleLabel')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
            />
          }
          label={t('bulletinBoard.important')}
        />
        <TextField
          label={t('bulletinBoard.textLabel')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          minRows={4}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !title || !text}
        >
          {t('common.create')}
        </Button>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
