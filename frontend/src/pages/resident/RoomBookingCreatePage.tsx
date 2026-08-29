import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper, Button, TextField } from '@mui/material'
import { createRoomBooking } from '../../api/requests'
import { useCommunityRooms } from '../../hooks/useCommunityRooms'

// Todo: Add Authentification

export function RoomBookingCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { communityRooms } = useCommunityRooms()
  const { id } = useParams<{ id: string }>()
  const communityRoomId = id ? Number(id) : null
  const selectedRoom = communityRooms.find(
    (room) => room.id === communityRoomId
  )
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleSave = async () => {
    if (communityRoomId === null || !startDate || !endDate) return
    setSaving(true)
    setActionError(null)
    try {
      await createRoomBooking({
        community_room_id: communityRoomId,
        start_date: startDate,
        end_date: endDate,
      })
      navigate(`/gemeinschaftsraum`)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        {/* community room */}
        <Typography>
          {t('roomBooking.bookCommunityRoom', {
            communityRoomName: selectedRoom?.name ?? '',
          })}
        </Typography>
        {/* startDate */}
        <TextField
          label={t('roomBooking.startDate')}
          value={startDate}
          type={'date'}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        {/* endDate */}
        <TextField
          label={t('roomBooking.endDate')}
          value={endDate}
          type={'date'}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !startDate || !endDate}
          >
            {t('common.create')}
          </Button>
          <Button
            onClick={() => navigate('/gemeinschaftsraum')}
            disabled={saving}
          >
            {t('common.cancel')}
          </Button>
        </Stack>

        {actionError && <Typography color="error">{actionError}</Typography>}
      </Stack>
    </Paper>
  )
}
