import { useState } from 'react'
import { createDormitory } from '../../api/dormitories.ts'
import { Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { BackButton } from '../../components/BackButton'

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
      <Stack spacing={3} style={{ alignItems: 'start' }}>
        <BackButton />
        <Typography>{t('dormitory.createDorm')}</Typography>

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
          value={zip_code}
          onChange={(e) => setZipCode(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !name}
          fullWidth
        >
          {t('common.create')}
        </Button>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
