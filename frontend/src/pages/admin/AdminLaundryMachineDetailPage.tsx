import { useEffect, useState } from 'react'
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
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  getLaundryMachineById,
  updateLaundryMachine,
  deleteLaundryMachine,
  type LaundryMachine,
  type LaundryMachineType,
  type LaundryStatus,
} from '../../api/infrastructure'
import { BackButton } from '../../components/BackButton.tsx'
import { Confirmation } from '../../components/Confirmation.tsx'

export function AdminLaundryMachineDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [machine, setMachine] = useState<LaundryMachine | null>(null)
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<LaundryMachineType>('Washingmachine')
  const [status, setStatus] = useState<LaundryStatus>('free')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    getLaundryMachineById(Number(id))
      .then((found) => {
        setMachine(found)
        setType(found.type)
        setStatus(found.status)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!machine) return
    setSaving(true)
    setError(null)
    try {
      await updateLaundryMachine(machine.id, {
        laundry_room_id: machine.laundry_room_id,
        type,
        status,
      })
      navigate('/waschmaschinen')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!machine) return
    setSaving(true)
    setError(null)
    try {
      await deleteLaundryMachine(machine.id)
      navigate('/waschmaschinen')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setSaving(false)
    }
  }

  if (loading) return <CircularProgress />
  if (!machine)
    return <Typography>{t('infrastructure.machineNotFound')}</Typography>

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '95%', md: '50%' },
        alignSelf: 'center',
        p: 4,
        gap: 2,
      }}
    >
      <Stack spacing={3} style={{ alignItems: 'start' }}>
        <BackButton />
        <Typography variant={'h4'}>
          {t('infrastructure.editMachine')}
        </Typography>
        <Divider sx={{ width: '100%' }} />

        <Typography>{machine.label}</Typography>

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

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
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
