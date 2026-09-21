import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  Stack,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
} from '@mui/material'
import { useLaundryMachines } from '../../hooks/useLaundryMachines'
import type { LaundryStatus } from '../../api/infrastructure'
import { useLaundryRooms } from '../../hooks/useLaundryRooms'
import { useState } from 'react'
import { useEndLaundryBooking } from '../../hooks/useEndLaundryBooking'
import { Loading } from '../../components/Loading'

const statusColor: Record<LaundryStatus, 'success' | 'warning' | 'error'> = {
  occupied: 'warning',
  free: 'success',
  unknown: 'error',
}

export function LaundryMachinesPage() {
  const { t } = useTranslation()
  const {
    laundryRooms,
    loading: roomsLoading,
    error: roomsError,
  } = useLaundryRooms()
  const [roomId, setRoomId] = useState<number | null>(null)
  const {
    machines: machinesData,
    loading: machinesLoading,
    error: machinesError,
    updateLaundryMachines,
  } = useLaundryMachines(roomId)

  const washingmaschines = machinesData.filter(
    (m) => m.type === 'Washingmachine'
  )
  const dryers = machinesData.filter((m) => m.type === 'Dryer')
  const {
    submitEndLaundryBooking,
    loading: submitEndLaundryBookingLoading,
    error: submitEndLaundryBookingError,
  } = useEndLaundryBooking()

  if (roomsLoading) return <Loading />
  if (roomsError) return <Typography color="error">{roomsError}</Typography>
  return (
    <Stack spacing={10}>
      <Typography variant="h1">{t('laundry.title')}</Typography>
      {machinesError && <Typography color="error">{machinesError}</Typography>}

      {/* select laundry room */}
      <TextField
        select
        label={t('laundry.selectLaundryRoom')}
        value={roomId ?? ''}
        onChange={(e) => setRoomId(Number(e.target.value))}
        disabled={laundryRooms.length === 0 || machinesLoading}
        fullWidth
      >
        {laundryRooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            {room.name}
          </MenuItem>
        ))}
      </TextField>
      {machinesLoading && <Loading />}

      {roomId !== null && !machinesLoading && (
        <Stack>
          {/* waschingmachines */}
          <Stack spacing={3}>
            <Typography variant="h2">{t('laundry.washingmachines')}</Typography>
            <Stack direction="row" spacing={3}>
              {washingmaschines.map((machine) => (
                <Paper key={machine.id} sx={{ p: 3, alignItems: 'center' }}>
                  <Stack sx={{ alignItems: 'center' }}>
                    <Typography color="primary">"{machine.label}"</Typography>
                    <Typography color="primary">
                      {t('laundry.washingmachine')}
                    </Typography>
                    {/* status display free or unknown */}
                    {(machine.status === 'free' ||
                      machine.status === 'unknown') && (
                      <Typography color={statusColor[machine.status]}>
                        {t(`laundry.status.${machine.status}`)}
                      </Typography>
                    )}
                    {/* status display occupied  with remaining time */}
                    {machine.status === 'occupied' &&
                      machine.occupied_until !== null && (
                        <Typography color={statusColor[machine.status]}>
                          {t('laundry.occupiedUntil', {
                            time: new Date(
                              machine.occupied_until
                            ).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            }),
                          })}
                        </Typography>
                      )}
                    {/* link to createBookingPage */}
                    {machine.status === 'free' && (
                      <Button
                        component={Link}
                        to={`/waschmaschinen/nutzen/${machine.id}`}
                      >
                        {t(`laundry.useMachine`)}
                      </Button>
                    )}
                    {/* endBooking */}
                    {machine.status === 'occupied' &&
                      machine.is_own_booking && (
                        <Button
                          color="error"
                          onClick={async () => {
                            const result = await submitEndLaundryBooking(
                              machine.current_booking_id
                            )
                            if (result !== null) {
                              updateLaundryMachines()
                            }
                          }}
                          disabled={submitEndLaundryBookingLoading}
                        >
                          {submitEndLaundryBookingLoading
                            ? t('common.ending')
                            : t(`laundry.endMachineUsage`)}
                        </Button>
                      )}
                    {submitEndLaundryBookingError && (
                      <Typography color="error">
                        {submitEndLaundryBookingError}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>

          {/* dryers */}
          <Stack spacing={3}>
            <Typography variant="h2">{t('laundry.dryers')}</Typography>
            <Stack direction="row" spacing={3}>
              {dryers.map((machine) => (
                <Paper key={machine.id} sx={{ p: 3, alignItems: 'center' }}>
                  <Stack sx={{ alignItems: 'center' }}>
                    <Typography color="primary">"{machine.label}"</Typography>
                    <Typography color="primary">
                      {t('laundry.dryer')}
                    </Typography>
                    {/* status display free or unknown */}
                    {(machine.status === 'free' ||
                      machine.status === 'unknown') && (
                      <Typography color={statusColor[machine.status]}>
                        {t(`laundry.status.${machine.status}`)}
                      </Typography>
                    )}
                    {/* status display occupied  with remaining time */}
                    {machine.status === 'occupied' &&
                      machine.occupied_until !== null && (
                        <Typography color={statusColor[machine.status]}>
                          {t('laundry.occupiedUntil', {
                            time: new Date(
                              machine.occupied_until
                            ).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            }),
                          })}
                        </Typography>
                      )}
                    {/* link to createBookingPage */}
                    {machine.status === 'free' && (
                      <Button
                        component={Link}
                        to={`/waschmaschinen/nutzen/${machine.id}`}
                      >
                        {t(`laundry.useMachine`)}
                      </Button>
                    )}
                    {/* endBooking */}
                    {machine.status === 'occupied' &&
                      machine.is_own_booking && (
                        <Button
                          color="error"
                          onClick={async () => {
                            const result = await submitEndLaundryBooking(
                              machine.current_booking_id
                            )
                            if (result !== null) {
                              updateLaundryMachines()
                            }
                          }}
                        >
                          {t(`laundry.endMachineUsage`)}
                        </Button>
                      )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
