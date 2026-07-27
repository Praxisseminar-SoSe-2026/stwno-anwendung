import { AppBar, Toolbar, Button, Stack } from '@mui/material'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { t } = useTranslation()

  const links = [
    { to: '/', label: 'Start' },
    { to: '/faq', label: t('faq.title') },
    { to: '/waschmaschinen', label: t('laundry.title') },
    { to: '/reparaturanfrage', label: t('repairRequest.title') },
    { to: '/gemeinschaftsraum', label: t('roomBooking.title') },
    { to: '/login', label: t('login.title') },
  ]

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Stack direction="row" spacing={3}>
          {links.map((link) => (
            <Button key={link.to} component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
