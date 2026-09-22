import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Divider,
} from '@mui/material'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLogout } from '../hooks/useLogout.ts'
import { useHasRole } from '../hooks/useHasRole.ts'
import { ADMIN_ROLES, STAFF_ROLES } from '../constants/roles.ts'
import { useDormitoryFilter } from '../contexts/DormitoryFilterContext'
import { useDormitories } from '../hooks/useDormitories'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

export function Header() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const { logout } = useLogout()
  const { dormitoryFilter, setDormitoryFilter } = useDormitoryFilter()
  const { dormitories } = useDormitories()

  const links = [
    { to: '/', label: 'Start' },
    { to: '/faq', label: t('faq.title') },
    { to: '/waschmaschinen', label: t('laundry.title') },
    { to: '/reparaturanfrage', label: t('repairRequest.title') },
    { to: '/gemeinschaftsraum', label: t('roomBooking.title') },
  ]

  const canViewTickets = useHasRole(STAFF_ROLES) && !loading
  const isAdmin = useHasRole(ADMIN_ROLES) && !loading

  const userSection = user ? (
    <>
      <Typography noWrap>
        {user.first_name} {user.last_name}
      </Typography>
      <Button onClick={logout}>Logout</Button>
    </>
  ) : (
    <Button component={Link} to="/login">
      {t('login.titleShort')}
    </Button>
  )

  const generalItems = [...links]

  const adminItems = [
    ...(canViewTickets
      ? [{ to: '/admin/tickets', label: t('adminTicketOverview.titleShort') }]
      : []),
    ...(isAdmin ? [{ to: '/admin/users', label: t('userList.title') }] : []),
  ]

  const dormitorySelect = canViewTickets && (
    <FormControl size="small">
      <Select
        value={dormitoryFilter}
        onChange={(e) => setDormitoryFilter(e.target.value)}
      >
        {dormitories.map((d) => (
          <MenuItem key={d.id} value={String(d.id)}>
            {d.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={3} alignItems="center">
          {generalItems.map((item) => (
            <Button key={item.to} component={Link} to={item.to}>
              {item.label}
            </Button>
          ))}

          {adminItems.length > 0 && (
            <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
          )}

          {adminItems.map((item) => (
            <Button key={item.to} component={Link} to={item.to}>
              {item.label}
            </Button>
          ))}

          {/* Dorm selection */}
          {canViewTickets && (
            <>
              <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
              {dormitorySelect}
              {isAdmin && dormitoryFilter && (
                <IconButton
                  component={Link}
                  to={`/dormitory/${dormitoryFilter}`}
                >
                  {/* Dorm edit */}
                  <EditIcon />
                </IconButton>
              )}
              {/* Dorm create */}
              {isAdmin && (
                <IconButton component={Link} to={'/dormitory/neu'}>
                  <AddIcon />
                </IconButton>
              )}
            </>
          )}
        </Stack>

        {/* Username + Logout */}
        <Stack direction="row" spacing={1} alignItems="center">
          {userSection}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}