import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Typography,
  Paper,
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Checkbox,
  IconButton,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../../contexts/AuthContext'
import { useCreateRepairRequest } from '../../hooks/useCreateRepairRequest'
import { useImageUpload } from '../../hooks/useImageUpload'

// Business hours of facility management
const BUSINESS_START_HOUR = 8
const LAST_START_HOUR = 15

function toLocalDateTimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

/**
 * check if datetime
 * fits inside working hours
 * @param value
 */
function isValidSlot(value: string): boolean {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime()) || date <= new Date()) return false

  // 0 = Sunday, 6 = Saturday
  const day = date.getDay()
  if (day === 0 || day === 6) return false

  const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes()
  return (
    minutesSinceMidnight >= BUSINESS_START_HOUR * 60 &&
    minutesSinceMidnight <= LAST_START_HOUR * 60
  )
}

export function RepairRequest() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { submitRepairRequest, loading, error } = useCreateRepairRequest()

  const [description, setDescription] = useState('')
  const [ownFlat, setOwnFlat] = useState<'yes' | 'no'>('yes')
  const [locationText, setLocationText] = useState('')
  const [entryPermission, setEntryPermission] = useState<'yes' | 'no'>('yes')
  const [noSlotWorks, setNoSlotWorks] = useState(false)
  const [slots, setSlots] = useState<[string, string, string]>(['', '', ''])
  const [proposedDateNote, setProposedDateNote] = useState('')
  const [success, setSuccess] = useState(false)

  const location = ownFlat === 'yes' ? (user?.flat_number ?? '') : locationText
  const slotsValid = slots.every((slot) => isValidSlot(slot))
  const minDateTime = toLocalDateTimeValue(new Date())
  const imageUpload = useImageUpload()

  // for submit description + location is needed
  // check on entry permission OR three proposed dates OR
  // no date + proposal
  const canSubmit =
    description.trim().length > 0 &&
    location.trim().length > 0 &&
    !imageUpload.uploading &&
    (entryPermission === 'yes' ||
      (noSlotWorks ? proposedDateNote.trim().length > 0 : slotsValid))

  const updateSlot = (index: number, value: string) => {
    setSlots((prev) => {
      const next = [...prev] as typeof prev
      next[index] = value
      return next
    })
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setSuccess(false)
    if (!canSubmit) return

    const result = await submitRepairRequest({
      description,
      location,
      image_url: imageUpload.imageUrl,
      entry_permission: entryPermission === 'yes',
      ...(entryPermission === 'no' && !noSlotWorks
        ? {
            proposed_time_slots: slots.map((slot) => ({
              start_time: new Date(slot).toISOString(),
            })),
          }
        : {}),
      ...(entryPermission === 'no' && noSlotWorks
        ? { proposed_date_note: proposedDateNote }
        : {}),
    })

    if (result) {
      setSuccess(true)
      setDescription('')
      setLocationText('')
      setSlots(['', '', ''])
      setProposedDateNote('')
      imageUpload.clear()
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        p: 4,
        gap: 2,
      }}
    >
      <Typography variant="h2">{t('repairRequest.title')}</Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {/* ----- Description ----- */}
        <FormControl>
          <FormLabel>{t('repairRequest.description')}</FormLabel>
          <TextField
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormControl>

        {/* ----- optional Image ----- */}
        <FormControl>
          <FormLabel>{t('repairRequest.image')}</FormLabel>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <IconButton
              component="label"
              disabled={imageUpload.uploading}
              sx={{ border: '1px solid', borderColor: 'divider', width: 48 }}
            >
              <UploadIcon />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void imageUpload.upload(file)
                  e.target.value = ''
                }}
              />
            </IconButton>
            {imageUpload.uploading && <CircularProgress size={24} />}
            {imageUpload.imageUrl && !imageUpload.uploading && (
              <>
                <Box
                  component="img"
                  src={imageUpload.imageUrl}
                  alt=""
                  sx={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 1 }}
                />
                <IconButton size="small" onClick={imageUpload.clear}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
          {imageUpload.error && (
            <Typography color="error" variant="body2">
              {imageUpload.error}
            </Typography>
          )}
        </FormControl>

        {/* ----- Location ----- */}
        <FormControl>
          <FormLabel>{t('repairRequest.ownFlat')}</FormLabel>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <RadioGroup
              row
              value={ownFlat}
              onChange={(e) => setOwnFlat(e.target.value as 'yes' | 'no')}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label={t('repairRequest.yes')}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label={t('repairRequest.no')}
              />
            </RadioGroup>
            <TextField
              placeholder={t('repairRequest.location')}
              value={location}
              onChange={(e) => setLocationText(e.target.value)}
              disabled={ownFlat === 'yes'}
              required
              sx={{ flexGrow: 1 }}
            />
          </Stack>
        </FormControl>

        {/* ----- Entry Permission ----- */}
        <FormControl>
          <FormLabel>{t('repairRequest.entryPermission')}</FormLabel>
          <RadioGroup
            row
            value={entryPermission}
            onChange={(e) => setEntryPermission(e.target.value as 'yes' | 'no')}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label={t('repairRequest.yes')}
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label={t('repairRequest.no')}
            />
          </RadioGroup>
        </FormControl>

        {/* ----- Proposed Dates ----- */}
        {entryPermission === 'no' && (
          <Paper
            variant="outlined"
            sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="body1">
              {noSlotWorks
                ? t('repairRequest.proposedDate')
                : t('repairRequest.chooseSlots')}
            </Typography>

            {!noSlotWorks &&
              slots.map((slotValue, index) => (
                <TextField
                  key={index}
                  type="datetime-local"
                  label={t('repairRequest.slot', { number: index + 1 })}
                  value={slotValue}
                  onChange={(e) => updateSlot(index, e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: minDateTime },
                  }}
                  error={slotValue !== '' && !isValidSlot(slotValue)}
                  helperText={
                    slotValue !== '' && !isValidSlot(slotValue)
                      ? t('repairRequest.slotInvalid')
                      : undefined
                  }
                  required
                />
              ))}
            {/* ----- Proposed Date Outside business hours ----- */}
            {noSlotWorks && (
              <TextField
                label={t('repairRequest.proposedDate')}
                value={proposedDateNote}
                onChange={(e) => setProposedDateNote(e.target.value)}
                required
              />
            )}
            {/* ----- No Slot Works ----- */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={noSlotWorks}
                  onChange={(e) => setNoSlotWorks(e.target.checked)}
                />
              }
              label={t('repairRequest.noSlotWorks')}
            />
          </Paper>
        )}
        {/* --- Submit --- */}
        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit || loading}
        >
          {loading ? t('repairRequest.submitting') : t('repairRequest.submit')}
        </Button>
        {/* --- Submit Messages --- */}
        {success && (
          <Alert severity="success">{t('repairRequest.success')}</Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Paper>
  )
}
