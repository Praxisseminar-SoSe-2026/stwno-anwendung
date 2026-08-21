import { useTranslation } from 'react-i18next'
import {
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import FullCalendar from '@fullcalendar/react'
import themePlugin from '@fullcalendar/react/themes/monarch'
import dayGridPlugin from '@fullcalendar/react/daygrid'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'

import { useCommunityRooms } from '../../hooks/useCommunityRooms'
import { useState } from 'react'

// calendar setup, made with docs [https://fullcalendar.io/docs/react]
export default function Calendar() {
  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin]}
      initialView="dayGridMonth"
      eventContent={renderEventContent}
    />
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export function RoomBookingPage() {
  const { t } = useTranslation()
  const { communityRooms, loading, error } = useCommunityRooms()
  const [roomId, setRoomId] = useState<number | null>(null)

  return (
    <Stack spacing={10}>
      <Typography variant="h1">{t('roomBooking.title')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

      {/* select community room */}
      <TextField
        select
        label={t('roomBooking.selectCommunityRoom')}
        value={roomId ?? ''}
        onChange={(e) => setRoomId(Number(e.target.value))}
        disabled={communityRooms.length === 0}
        fullWidth
      >
        {communityRooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            {room.name}
          </MenuItem>
        ))}
      </TextField>
      {loading && <CircularProgress />}
      <Calendar />
    </Stack>
  )
}
