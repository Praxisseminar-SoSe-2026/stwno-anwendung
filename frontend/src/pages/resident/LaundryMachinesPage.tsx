import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  Stack,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material'
import { useLaundryMachines } from '../../hooks/useLaundryMachines'
import type { LaundryStatus } from '../../api/infrastructure'
import { useLaundryRooms } from '../../hooks/useLaundryRooms'
import { useEffect, useMemo, useState } from 'react'
import { useEndLaundryBooking } from '../../hooks/useEndLaundryBooking'
import { Loading } from '../../components/Loading'
import { useDormitoryFilter } from '../../contexts/DormitoryFilterContext.tsx'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { EDITOR_ROLES, STAFF_ROLES } from '../../constants/roles.ts'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

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
  const { dormitoryFilter } = useDormitoryFilter()
  const isStaff = useHasRole(STAFF_ROLES)
  const canEdit = useHasRole(EDITOR_ROLES)
  const [roomId, setRoomId] = useState<number | null>(null)
  const {
    machines: machinesData,
    loading: machinesLoading,
    error: machinesError,
    updateLaundryMachines,
  } = useLaundryMachines(roomId)

  /*useMemo to safe selected dorm value*/
  const visibleRooms = useMemo(() => {
    if (!isStaff) return laundryRooms
    return laundryRooms.filter(
      (room) => room.dormitory_id === Number(dormitoryFilter)
    )
  }, [laundryRooms, isStaff, dormitoryFilter])

  const washingmaschines = machinesData.filter(
    (m) => m.type === 'Washingmachine'
  )
  const dryers = machinesData.filter((m) => m.type === 'Dryer')
  const {
    submitEndLaundryBooking,
    loading: submitEndLaundryBookingLoading,
    error: submitEndLaundryBookingError,
  } = useEndLaundryBooking()

  /* reset roomId if dorm is changed*/
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoomId(null)
  }, [dormitoryFilter])

  if (roomsLoading) return <Loading />
  if (roomsError) return <Typography color="error">{roomsError}</Typography>

  return (
    <Stack spacing={1}>
      <Typography variant="h1">{t('laundry.title')}</Typography>

      {machinesError && <Typography color="error">{machinesError}</Typography>}
      <Stack direction="row">
        {/* select laundry room */}
        <TextField
          select
          label={t('laundry.selectLaundryRoom')}
          value={roomId ?? ''}
          onChange={(e) => setRoomId(Number(e.target.value))}
          disabled={visibleRooms.length === 0}
          fullWidth
        >
          {visibleRooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </TextField>
        {canEdit && (
          <IconButton component={Link} to="/waschmaschinen/waschraum/neu">
            <AddIcon />
          </IconButton>
        )}
        {canEdit && roomId && (
          <IconButton
            component={Link}
            to={`/waschmaschinen/waschraum/${roomId}`}
          >
            <EditIcon />
          </IconButton>
        )}
      </Stack>
      {machinesLoading && <Loading />}

      <Stack direction="row" spacing={3}>
        <Typography variant="h1">{t('laundry.machines')}</Typography>
        {canEdit && roomId && (
          <IconButton
            component={Link}
            to={`/waschmaschinen/waschraum/${roomId}/maschine/neu`}
          >
            <AddIcon />
          </IconButton>
        )}
      </Stack>
      {/* waschingmachines */}
      {roomId !== null && !machinesLoading && (
        <>
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
                    {canEdit && (
                      <IconButton
                        component={Link}
                        to={`/waschmaschinen/waschraum/${roomId}/maschine/${machine.id}`}
                      >
                        <EditIcon />
                      </IconButton>
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
                    {canEdit && (
                      <IconButton
                        component={Link}
                        to={`/waschmaschinen/waschraum/${roomId}/maschine/${machine.id}`}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  )
}
