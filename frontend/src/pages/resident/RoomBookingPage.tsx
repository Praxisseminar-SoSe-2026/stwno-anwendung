import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material'
import { Link } from 'react-router'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

import FullCalendar from '@fullcalendar/react'
import themePlugin from '@fullcalendar/react/themes/monarch'
import dayGridPlugin from '@fullcalendar/react/daygrid'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'

import { useCommunityRooms } from '../../hooks/useCommunityRooms'
import { useRoomBookings } from '../../hooks/useRoomBookings'

import { Loading } from '../../components/Loading'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { STAFF_ROLES, EDITOR_ROLES } from '../../constants/roles.ts'
import { useDormitoryFilter } from '../../contexts/DormitoryFilterContext.tsx'

import { Divider } from '@mui/material'

type RoomBookingEvent = {
  id: string
  title: string
  start: string
  end: string
}

export default function Calendar({ events }: { events: RoomBookingEvent[] }) {
  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
      eventContent={renderEventContent}
      eventColor={useTheme().palette.error.main}
    />
  )
}

function renderEventContent(eventInfo) {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <i>{eventInfo.event.title}</i>
    </div>
  )
}

export function RoomBookingPage() {
  const { t } = useTranslation()

  const {
    communityRooms,
    loading: roomsLoading,
    error: roomsError,
  } = useCommunityRooms()
  const {
    roomBookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useRoomBookings()

  const { dormitoryFilter } = useDormitoryFilter()
  const isStaff = useHasRole(STAFF_ROLES)
  const canEdit = useHasRole(EDITOR_ROLES)
  const [roomId, setRoomId] = useState<number | null>(null)

  const visibleRooms = useMemo(() => {
    if (!isStaff) return communityRooms
    return communityRooms.filter(
      (room) => room.dormitory_id === Number(dormitoryFilter)
    )
  }, [communityRooms, isStaff, dormitoryFilter])

  const roomBookingEvents: RoomBookingEvent[] = roomId
    ? roomBookings
        .filter(
          (booking) =>
            booking.community_room_id === roomId &&
            (booking.status === 'in_progress' || booking.status === 'closed')
        )
        .map((booking) => ({
          id: String(booking.id),
          title: t('roomBooking.occupied'),
          start: booking.start_datetime,
          end: booking.end_datetime,
        }))
    : []

  const selectedRoom = visibleRooms.find((room) => room.id === roomId) ?? null

  /* reset roomId if dorm is changed*/
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoomId(null)
  }, [dormitoryFilter])

  if (roomsLoading) return <Loading />
  if (roomsError) return <Typography color="error">{roomsError}</Typography>

  return (
    <Stack
      spacing={3}
      sx={{ width: { xs: '100%', md: '50%' }, alignSelf: 'center' }}
    >
      <Typography variant="h1">{t('roomBooking.title')}</Typography>
      <Divider />
      {/* select community room */}
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          select
          label={t('roomBooking.selectCommunityRoom')}
          value={roomId ?? ''}
          onChange={(e) => setRoomId(Number(e.target.value))}
          disabled={visibleRooms.length === 0}
          sx={{ width: { xs: '70%', sm: '50%' } }}
        >
          {visibleRooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </TextField>

        {canEdit && (
          <IconButton component={Link} to="/gemeinschaftsraum/neu">
            <AddIcon />
          </IconButton>
        )}
        {canEdit && roomId && (
          <IconButton component={Link} to={`/gemeinschaftsraum/${roomId}`}>
            <EditIcon />
          </IconButton>
        )}
      </Stack>
      {selectedRoom?.description && (
        <Typography>
          {t('infrastructure.description')}
          {': '} {selectedRoom.description}
        </Typography>
      )}

      {roomId !== null &&
        (bookingsLoading ? (
          <Loading />
        ) : (
          <Stack spacing={2} sx={{ width: 'auto' }}>
            <Button
              component={Link}
              variant="contained"
              to={`/gemeinschaftsraum/anfrage/${roomId}`}
              sx={{ width: 'auto', alignSelf: 'center' }}
            >
              {t('roomBooking.createCommunityRoomBooking')}
            </Button>
            <Calendar events={roomBookingEvents} />
          </Stack>
        ))}
      {bookingsError && <Typography color="error">{bookingsError}</Typography>}
    </Stack>
  )
}
