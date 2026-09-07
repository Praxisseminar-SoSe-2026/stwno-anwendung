import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper } from '@mui/material'
import { useLaundryMachines } from '../../hooks/useLaundryMachines'
import type { LaundryStatus } from '../../api/infrastructure'

const statusColor: Record<LaundryStatus, 'success' | 'warning' | 'error'> = {
  occupied: 'warning',
  free: 'success',
  unknown: 'error',
}

export function LaundryMachinesPage() {
  const { t } = useTranslation()
  const machinesData = useLaundryMachines(1).machines

  const washingmaschines = machinesData.filter(
    (m) => m.type === 'Washingmachine'
  )
  const dryers = machinesData.filter((m) => m.type === 'Dryer')

  return (
    <Stack spacing={10}>
      <Typography variant="h1">{t('laundry.title')}</Typography>

      {/* waschingmachines */}
      <Stack spacing={3}>
        <Typography variant="h2">{t('laundry.washingmachines')}</Typography>
        <Stack direction="row" spacing={3}>
          {washingmaschines.map((machine, index) => (
            <Paper key={machine.id} sx={{ p: 3, alignItems: 'center' }}>
              <Stack sx={{ alignItems: 'center' }}>
                <Typography color="primary">
                  {t('laundry.washingmachine')} {index + 1}
                </Typography>
                <Typography color={statusColor[machine.status]}>
                  {t(`laundry.status.${machine.status}`)}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>

      {/* dryers */}
      <Stack spacing={3}>
        <Typography variant="h2">{t('laundry.dryers')}</Typography>
        <Stack direction="row" spacing={3}>
          {dryers.map((machine, index) => (
            <Paper key={machine.id} sx={{ p: 3, alignItems: 'center' }}>
              <Stack sx={{ alignItems: 'center' }}>
                <Typography color="primary">
                  {t('laundry.dryer')} {index + 1}
                </Typography>
                <Typography color={statusColor[machine.status]}>
                  {t(`laundry.status.${machine.status}`)}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
