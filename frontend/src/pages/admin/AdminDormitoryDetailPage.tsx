import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper, Button, TextField } from '@mui/material'
import {
  getDormitories,
  updateDormitory,
  deleteDormitory,
  type Dormitory,
} from '../../api/dormitories'

export function AdminDormitoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const [dormitory, setDormitory] = useState<Dormitory | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDormitories()
      .then((dormitories) => {
        const found = dormitories.find((d) => d.id === Number(id)) ?? null
        setDormitory(found)
        setName(found?.name ?? '')
        setAddress(found?.address ?? '')
        setCity(found?.city ?? '')
        setZipCode(found?.zip_code ?? '')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed'))
  }, [id])

  const handleSave = async () => {
    if (!dormitory) return
    setSaving(true)
    setError(null)
    try {
      await updateDormitory(dormitory.id, {
        name,
        address,
        city,
        zip_code: zipCode,
      })
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!dormitory) return
    setSaving(true)
    setError(null)
    try {
      await deleteDormitory(dormitory.id)
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setSaving(false)
    }
  }

  return (
    <Paper>
      <Stack spacing={2}>
        <Typography variant="h4">{t('dormitory.editDorm')}</Typography>

          {/* Name */}
        <TextField
          label={t('dormitory.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
          {/* Address */}
        <TextField
          label={t('dormitory.address')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
          {/* City */}
        <TextField
          label={t('dormitory.city')}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
        />
          {/* Zip code */}
        <TextField
          label={t('dormitory.zipCode')}
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
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
