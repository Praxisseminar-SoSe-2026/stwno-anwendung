import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { useAnnouncement } from '../../hooks/useAnnouncement'
import { updateAnnouncement, deleteAnnouncement } from '../../api/announcements'
import { useAuth } from '../../contexts/AuthContext'

const EDITOR_ROLES = ['admin']

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { hasRole } = useAuth()
  const { announcement, loading, error, setAnnouncement } = useAnnouncement(
    Number(id)
  )

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [important, setImportant] = useState(false)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const canEdit = EDITOR_ROLES.some((role) => hasRole(role))

  const startEditing = () => {
    if (!announcement) return
    setTitle(announcement.title)
    setImportant(announcement.important ?? false)
    setText(announcement.text)
    setEditing(true)
  }

  const handleSave = async () => {
    if (!announcement) return
    setSaving(true)
    setActionError(null)
    try {
      const updated = await updateAnnouncement(announcement.id, {
        title,
        important,
        text,
      })
      setAnnouncement(updated)
      setEditing(false)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!announcement) return
    setSaving(true)
    setActionError(null)
    try {
      await deleteAnnouncement(announcement.id)
      navigate('/aushang')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed')
      setSaving(false)
    }
  }

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error}</Typography>
  if (!announcement) return null

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        {editing ? (
          <>
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
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
              <Typography variant="h4">{announcement.title}</Typography>
              <Typography variant="h6" color="text.secondary">
                {announcement.created_at &&
                  new Date(announcement.created_at).toLocaleDateString()}
              </Typography>
              {announcement.important && (
                <Chip
                  label={t('bulletinBoard.important')}
                  color="error"
                  size="small"
                />
              )}
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {announcement.text}
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
