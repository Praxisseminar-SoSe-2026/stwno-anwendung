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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material'
import { createAnnouncement } from '../../api/announcements'
import { useDormitories } from '../../hooks/useDormitories'

const GLOBAL_VALUE = 'global'

export function AdminCreateAnnouncementPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { dormitories } = useDormitories()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [important, setImportant] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scope, setScope] = useState<string>(GLOBAL_VALUE)

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const created = await createAnnouncement({
        title,
        text,
        important,
        dormitory_id: scope === GLOBAL_VALUE ? null : Number(scope),
      })
      navigate(`/aushang/${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
      setSaving(false)
    }
  }

  /* TODO: Add optional image upload */
  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">
          {t('bulletinBoard.createAnnouncement')}
        </Typography>

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

        <FormControl fullWidth>
          <InputLabel id="scope-label">{t('bulletinBoard.scope')}</InputLabel>
          <Select
            labelId="scope-label"
            value={scope}
            label={t('bulletinBoard.scope')}
            onChange={(e) => setScope(e.target.value)}
          >
            <MenuItem value={GLOBAL_VALUE}>
              {t('bulletinBoard.scopeGlobal')}
            </MenuItem>
            {dormitories.map((d) => (
              <MenuItem key={d.id} value={String(d.id)}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
