import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  Divider,
} from '@mui/material'
import {
  getLaundryRooms,
  updateLaundryRoom,
  deleteLaundryRoom,
  type LaundryRoom,
} from '../../api/infrastructure'
import { Loading } from '../../components/Loading'
import { BackButton } from '../../components/BackButton'
import { Confirmation } from '../../components/Confirmation.tsx'

export function AdminLaundryRoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [room, setRoom] = useState<LaundryRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    getLaundryRooms()
      .then((rooms) => {
        const found = rooms.find((r) => r.id === Number(id)) ?? null
        setRoom(found)
        setName(found?.name ?? '')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!room) return
    setSaving(true)
    setError(null)
    try {
      await updateLaundryRoom(room.id, { name })
      navigate('/waschmaschinen')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!room) return
    setSaving(true)
    setError(null)
    try {
      await deleteLaundryRoom(room.id)
      navigate('/waschmaschinen')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <Paper
      variant="outlined"
      sx={{
        width: { xs: '95%', md: '50%' },
        alignSelf: 'center',
        p: 4,
        gap: 2,
      }}
    >
      <Stack spacing={3} style={{ alignItems: 'start' }}>
        <BackButton />
        <Typography variant={'h4'}>{t('infrastructure.editRoom')}</Typography>
        <Divider sx={{ width: '100%' }} />
        {/* Name */}
        <TextField
          label={t('infrastructure.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !name}
          >
            {t('common.save')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmOpen(true)}
            disabled={saving}
          >
            {t('common.delete')}
          </Button>
        </Stack>

        <Confirmation
          open={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false)
            handleDelete()
          }}
          onClose={() => setConfirmOpen(false)}
        />
        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
