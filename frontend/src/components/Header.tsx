import { AppBar, Toolbar, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLogout } from '../hooks/useLogout.ts'
import { useHasRole } from '../hooks/useHasRole.ts'
import { STAFF_ROLES } from '../constants/roles.ts'

export function Header() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const { logout } = useLogout()

  const links = [
    { to: '/', label: 'Start' },
    { to: '/faq', label: t('faq.title') },
    { to: '/waschmaschinen', label: t('laundry.title') },
    { to: '/reparaturanfrage', label: t('repairRequest.title') },
    { to: '/gemeinschaftsraum', label: t('roomBooking.title') },
  ]

  const canViewTickets = useHasRole(STAFF_ROLES) && !loading

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={3}>
          {links.map((link) => (
            <Button key={link.to} component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
          {canViewTickets && (
            <Button component={Link} to="/admin/tickets">
              {t('adminTicketOverview.titleShort')}
            </Button>
          )}
        </Stack>
        <Stack>
          {user ? (
            <>
              <Typography>
                {user.first_name} {user.last_name}
              </Typography>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button key={'/login'} component={Link} to={'/login'}>
              {t('login.titleShort')}
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
