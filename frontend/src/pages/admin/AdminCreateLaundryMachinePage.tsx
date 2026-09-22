import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  createLaundryMachine,
  type LaundryMachineType,
  type LaundryStatus,
} from '../../api/infrastructure'
import { BackButton } from '../../components/BackButton.tsx'

export function AdminCreateLaundryMachinePage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [type, setType] = useState<LaundryMachineType>('Washingmachine')
  const [status, setStatus] = useState<LaundryStatus>('free')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!roomId) return
    setSaving(true)
    setError(null)
    try {
      await createLaundryMachine({
        laundry_room_id: Number(roomId),
        type,
        status,
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
      <Stack spacing={3} style={{ alignItems: 'start' }}>
        <BackButton />
        <Typography>{t('infrastructure.createMachine')}</Typography>

        {/* Device type */}
        <FormControl fullWidth>
          <InputLabel>{t('infrastructure.type')}</InputLabel>
          <Select
            value={type}
            label={t('infrastructure.type')}
            onChange={(e) => setType(e.target.value as LaundryMachineType)}
          >
            <MenuItem value="Washingmachine">
              {t('laundry.washingmachine')}
            </MenuItem>
            <MenuItem value="Dryer">{t('laundry.dryer')}</MenuItem>
          </Select>
        </FormControl>

        {/* Usage status */}
        <FormControl fullWidth>
          <InputLabel>{t('infrastructure.status')}</InputLabel>
          <Select
            value={status}
            label={t('infrastructure.status')}
            onChange={(e) => setStatus(e.target.value as LaundryStatus)}
          >
            <MenuItem value="free">{t('laundry.status.free')}</MenuItem>
            <MenuItem value="occupied">{t('laundry.status.occupied')}</MenuItem>
            <MenuItem value="unknown">{t('laundry.status.unknown')}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          fullWidth
        >
          {t('common.create')}
        </Button>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
