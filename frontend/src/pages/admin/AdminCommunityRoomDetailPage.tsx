import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  getCommunityRooms,
  updateCommunityRoom,
  deleteCommunityRoom,
  type CommunityRoom,
} from '../../api/infrastructure'
import { BackButton } from '../../components/BackButton'
import { Confirmation } from '../../components/Confirmation.tsx'

export function AdminCommunityRoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [room, setRoom] = useState<CommunityRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    getCommunityRooms()
      .then((rooms) => {
        const found = rooms.find((r) => r.id === Number(id)) ?? null
        setRoom(found)
        setName(found?.name ?? '')
        setDescription(found?.description ?? '')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!room) return
    setSaving(true)
    setError(null)
    try {
      await updateCommunityRoom(room.id, {
        name,
        description: description || null,
      })
      navigate('/gemeinschaftsraum')
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
      await deleteCommunityRoom(room.id)
      navigate('/gemeinschaftsraum')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setSaving(false)
    }
  }

  if (loading) return <CircularProgress />

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
        <Typography variant="h4">{t('infrastructure.editRoom')}</Typography>

        <Divider sx={{ width: '100%' }} />

        {/* Name */}
        <TextField
          label={t('infrastructure.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        {/* Description */}
        <TextField
          label={t('infrastructure.description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
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
