import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper, Button, TextField } from '@mui/material'
import { createCommunityRoom } from '../../api/infrastructure'
import { useDormitoryFilter } from '../../contexts/DormitoryFilterContext.tsx'

export function AdminCreateCommunityRoomPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { dormitoryFilter } = useDormitoryFilter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      await createCommunityRoom({
        name,
        description: description || null,
        dormitory_id: Number(dormitoryFilter),
      })
      navigate('/gemeinschaftsraum')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
      setSaving(false)
    }
  }

  return (
    <Paper>
      <Stack>
        <Typography>{t('infrastructure.createRoom')}</Typography>

        <TextField
          label={t('infrastructure.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label={t('infrastructure.description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !name}
        >
          {t('common.create')}
        </Button>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
