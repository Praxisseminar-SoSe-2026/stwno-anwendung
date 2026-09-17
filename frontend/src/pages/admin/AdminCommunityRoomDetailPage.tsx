import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper, Button, TextField, CircularProgress } from '@mui/material'
import {
  getCommunityRooms,
  updateCommunityRoom,
  deleteCommunityRoom,
  type CommunityRoom,
} from '../../api/infrastructure'

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
    <Paper>
      <Stack spacing={2}>
        <Typography variant="h4">{t('infrastructure.editRoom')}</Typography>

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
            onClick={handleDelete}
            disabled={saving}
          >
            {t('common.delete')}
          </Button>
        </Stack>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}