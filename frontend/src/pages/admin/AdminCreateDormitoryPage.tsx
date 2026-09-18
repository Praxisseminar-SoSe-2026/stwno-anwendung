import { useState } from 'react'
import { createDormitory } from '../../api/dormitories.ts'
import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function AdminCreateDormitoryPage() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip_code, setZipCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      await createDormitory({
        name,
        address,
        city,
        zip_code,
      })
      /* normal navigate does not refresh the page with new dorm */
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
      setSaving(false)
    }
  }

  return (
    <Paper>
      <Stack spacing={2}>
        <Typography>{t('dormitory.createDorm')}</Typography>

        <TextField
          label={t('dormitory.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label={t('dormitory.address')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        <TextField
          label={t('dormitory.city')}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
        />
        <TextField
          label={t('dormitory.zipCode')}
          value={zip_code}
          onChange={(e) => setZipCode(e.target.value)}
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
