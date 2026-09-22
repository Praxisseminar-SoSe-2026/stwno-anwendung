import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper, Button, TextField } from '@mui/material'
import { createLaundryRoom } from '../../api/infrastructure'
import { useDormitoryFilter } from '../../contexts/DormitoryFilterContext.tsx'

export function AdminCreateLaundryRoomPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { dormitoryFilter } = useDormitoryFilter()

  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      await createLaundryRoom({
        name,
        dormitory_id: Number(dormitoryFilter),
      })
      navigate('/waschmaschinen')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
      setSaving(false)
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        alignSelf: 'center',
        p: 4,
        gap: 2,
      }}
    >
      <Stack spacing={3}>
        <Typography>{t('infrastructure.createRoom')}</Typography>

        {/* Name */}
        <TextField
          label={t('infrastructure.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
