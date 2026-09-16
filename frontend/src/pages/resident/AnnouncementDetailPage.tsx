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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { useAnnouncement } from '../../hooks/useAnnouncement'
import { useDeleteAnnouncement } from '../../hooks/useDeleteAnnouncement'
import { useUpdateAnnouncement } from '../../hooks/useUpdateAnnouncement'
import { useDormitories } from '../../hooks/useDormitories'
import { useImageUpload } from '../../hooks/useImageUpload.ts'
import UploadIcon from '@mui/icons-material/Upload'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { EDITOR_ROLES } from '../../constants/roles.ts'

const GLOBAL_VALUE = 'global'

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const imageUpload = useImageUpload()
  const { announcement, loading, error, setAnnouncement } = useAnnouncement(
    Number(id)
  )

  const {
    submitDeleteAnnouncement,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteAnnouncement()
  const {
    submitUpdateAnnouncement,
    loading: updateLoading,
    error: updateError,
  } = useUpdateAnnouncement()

  const { dormitories } = useDormitories()

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [important, setImportant] = useState(false)
  const [text, setText] = useState('')
  const [imageRemoved, setImageRemoved] = useState(false)
  const [scope, setScope] = useState<string>(GLOBAL_VALUE)

  const actionLoading = updateLoading || deleteLoading
  const actionError = updateError || deleteError

  const canEdit = useHasRole(EDITOR_ROLES)

  const startEditing = () => {
    if (!announcement) return
    setTitle(announcement.title)
    setImportant(announcement.important ?? false)
    setText(announcement.text)
    setScope(
      announcement.dormitory_id === null
        ? GLOBAL_VALUE
        : String(announcement.dormitory_id)
    )
    setImageRemoved(false)
    imageUpload.clear()
    setEditing(true)
  }

  const handleRemoveImage = () => {
    setImageRemoved(true)
    imageUpload.clear?.()
  }

  const handleSave = async () => {
    if (!announcement) return

    const result = await submitUpdateAnnouncement(announcement.id, {
      title,
      important,
      text,
      image_url: imageRemoved
        ? null
        : (imageUpload.imageUrl ?? announcement.image_url),
      dormitory_id: scope === GLOBAL_VALUE ? null : Number(scope),
    })
    if (result) {
      setAnnouncement(result)
      setEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!announcement) return
    const result = await submitDeleteAnnouncement(announcement.id)
    if (result) {
      navigate('/')
    }
  }

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error}</Typography>
  if (!announcement) return null

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Button onClick={() => navigate(-1)}>{t('common.back')}</Button>
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

            <FormControl fullWidth>
              <InputLabel id="scope-label">
                {t('bulletinBoard.scope')}
              </InputLabel>
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

            <Stack spacing={1}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadIcon />}
                disabled={imageUpload.uploading}
              >
                {!imageUpload.uploading && t('bulletinBoard.uploadImage')}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageRemoved(false)
                      imageUpload.upload(file)
                    }
                  }}
                />
              </Button>

              {!imageRemoved &&
                (imageUpload.imageUrl ?? announcement.image_url) && (
                  <Stack spacing={1}>
                    <Button
                      component="label"
                      variant="outlined"
                      color="error"
                      onClick={handleRemoveImage}
                    >
                      {t('bulletinBoard.removeImage')}
                    </Button>
                    <img
                      src={
                        imageUpload.imageUrl ??
                        announcement.image_url ??
                        undefined
                      }
                      alt=""
                      style={{ maxWidth: '200px', borderRadius: 4 }}
                    />
                  </Stack>
                )}

              {imageUpload.error && (
                <Typography color="error">{imageUpload.error}</Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={actionLoading}
              >
                {t('common.save')}
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

            {announcement.image_url && (
              <img src={announcement.image_url} style={{ maxWidth: '50%' }} />
            )}

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
