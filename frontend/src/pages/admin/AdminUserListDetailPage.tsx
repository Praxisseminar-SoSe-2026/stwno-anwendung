import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material'
import { useUsers } from '../../hooks/useUsers.ts'
import { useDormitories } from '../../hooks/useDormitories.ts'
import { updateUser } from '../../api/users.ts'
import { ALL_ROLES } from '../../constants/roles.ts'

const NO_DORMITORY = 'none'

export function AdminUserListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { users } = useUsers()
  const { dormitories } = useDormitories()

  const user = users.find((u) => u.id === Number(id)) ?? null

  const [initialized, setInitialized] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [flatNumber, setFlatNumber] = useState('')
  const [dormitoryId, setDormitoryId] = useState<string>(NO_DORMITORY)
  const [contractEnd, setContractEnd] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (user && !initialized) {
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setEmail(user.email)
    setFlatNumber(user.flat_number ?? '')
    setDormitoryId(
      user.dormitory_id === null ? NO_DORMITORY : String(user.dormitory_id)
    )
    setContractEnd(user.contract_end ?? '')
    setRoles(user.roles)
    setInitialized(true)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      await updateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        flat_number: flatNumber || null,
        dormitory_id: dormitoryId === NO_DORMITORY ? null : Number(dormitoryId),
        contract_end: contractEnd || null,
        roles,
      })
      navigate('/admin/users')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      setSaving(false)
    }
  }
  if (!user) return <Typography>{t('userList.notFound')}</Typography>

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
      <Stack spacing={3}>
        <Typography variant="h4">{t('userList.editUser')}</Typography>
        <Divider sx={{ width: '100%' }} />
        {/* Person number */}
        <Typography>
          {t('userList.personNumber')}: {user.person_number}
        </Typography>

        {/* First Name*/}
        <TextField
          label={t('userList.firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
        />
        {/* Last Name */}
        <TextField
          label={t('userList.lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
        />
        {/* Mail */}
        <TextField
          label={t('userList.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        {/* Flat number*/}
        <TextField
          label={t('userList.flatNumber')}
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          fullWidth
        />

        {/* dormitory*/}
        {/* TODO: change managed dorms for "hausmeister"*/}
        <FormControl fullWidth>
          <InputLabel>{t('userList.dormitory')}</InputLabel>
          <Select
            value={dormitoryId}
            label={t('userList.dormitory')}
            onChange={(e) => setDormitoryId(e.target.value)}
          >
            <MenuItem value={NO_DORMITORY}>
              {t('userList.noDormitory')}
            </MenuItem>
            {dormitories.map((d) => (
              <MenuItem key={d.id} value={String(d.id)}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Contract end*/}
        <TextField
          label={t('userList.contractEnd')}
          type="date"
          value={contractEnd}
          onChange={(e) => setContractEnd(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        {/* Roles*/}
        <Stack spacing={1}>
          <Typography>{t('userList.roles')}</Typography>
          <ToggleButtonGroup
            value={roles}
            onChange={(_, newRoles) => setRoles(newRoles)}
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            {ALL_ROLES.map((role) => (
              <ToggleButton key={role} value={role}>
                {role}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !firstName || !lastName}
          >
            {t('common.save')}
          </Button>
          <Button onClick={() => navigate('/admin/users')} disabled={saving}>
            {t('common.cancel')}
          </Button>
        </Stack>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
