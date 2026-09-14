import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import { useCreateLaundryBooking } from '../../hooks/useCreateLaundryBooking'
import { useLaundryMachine } from '../../hooks/useLaundryMachine'

// Todo: Add Authentification

export function LaundryBookingCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { id } = useParams<{ id: string }>()
  const laundryMachineId = id ? Number(id) : null

  const laundryMachine = useLaundryMachine(laundryMachineId).machine

  const [duration, setDuration] = useState('')

  const { submitLaundryBooking, loading, error } = useCreateLaundryBooking()

  const handleSave = async () => {
    if (laundryMachineId === null || !duration) return

    const result = await submitLaundryBooking({
      laundry_machine_id: laundryMachineId,
      duration: Number(duration),
    })

    if (result) {
      navigate('/waschmaschinen')
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography>
          {t('laundry.communicateLaundryMachineUsage', {
            laundryMachineLabel: laundryMachine?.label ?? '',
          })}
        </Typography>

        {/* duration */}
        <TextField
          label={t('laundry.howLongUseMachine')}
          value={duration}
          type={'number'}
          onChange={(e) => setDuration(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {t('common.minutes')}
                </InputAdornment>
              ),
            },
          }}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !duration}
          >
            {t('common.create')}
          </Button>
          <Button
            onClick={() => navigate('/waschmaschinen')}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
        </Stack>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
