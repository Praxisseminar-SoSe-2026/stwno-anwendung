import { useState } from 'react'
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
  useMediaQuery,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLogout } from '../hooks/useLogout.ts'
import { useHasRole } from '../hooks/useHasRole.ts'
import { ADMIN_ROLES, STAFF_ROLES, RESIDENT_ROLES } from '../constants/roles.ts'
import { useDormitoryFilter } from '../contexts/DormitoryFilterContext'
import { useDormitories } from '../hooks/useDormitories'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import MenuIcon from '@mui/icons-material/Menu'
import { theme } from '../theme/theme.tsx'

export function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { logout } = useLogout()
  const { dormitoryFilter, setDormitoryFilter } = useDormitoryFilter()
  const { dormitories } = useDormitories()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // -> mobile till 900px width

  const links = [
    { to: '/', label: 'Start' },
    { to: '/faq', label: t('faq.title') },
    { to: '/waschmaschinen', label: t('laundry.title') },
    { to: '/reparaturanfrage', label: t('repairRequest.title') },
    { to: '/gemeinschaftsraum', label: t('roomBooking.title') },
  ]

  const canViewOwnTickets = useHasRole(RESIDENT_ROLES)
  const canViewTickets = useHasRole(STAFF_ROLES) && !loading
  const isAdmin = useHasRole(ADMIN_ROLES) && !loading

  const handleNavigate = (to: string) => {
    setDrawerOpen(false)
    navigate(to)
  }

  const handleLogout = () => {
    setDrawerOpen(false)
    logout()
  }

  const userSection = user ? (
    <>
      <Typography noWrap>
        {user.first_name} {user.last_name}
      </Typography>
      <Button onClick={isMobile ? handleLogout : logout}>Logout</Button>
    </>
  ) : (
    <Button component={Link} to="/login">
      {t('login.titleShort')}
    </Button>
  )

  const generalItems = [
    ...links,
    ...(canViewOwnTickets
      ? [{ to: '/meine-tickets', label: t('request.myTickets') }]
      : []),
  ]

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

  const dormitoryActions = isAdmin && (
    <Stack direction="row">
      {dormitoryFilter && (
        <Button
          startIcon={<EditIcon />}
          component={Link}
          to={`/dormitory/${dormitoryFilter}`}
          onClick={() => isMobile && setDrawerOpen(false)}
        ></Button>
      )}
      <Button
        startIcon={<AddIcon />}
        component={Link}
        to="/dormitory/neu"
        onClick={() => isMobile && setDrawerOpen(false)}
      ></Button>
    </Stack>
  )

  // Mobile

  if (isMobile) {
    return (
      <>
        <AppBar position="sticky" color="default">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 260, p: 2 }} role="presentation">
            <List>
              {generalItems.map((item) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton onClick={() => handleNavigate(item.to)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {adminItems.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <List>
                  {adminItems.map((item) => (
                    <ListItem key={item.to} disablePadding>
                      <ListItemButton onClick={() => handleNavigate(item.to)}>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {canViewTickets && (
              <>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1} sx={{ px: 1 }}>
                  {dormitorySelect}
                  {dormitoryActions}
                </Stack>
              </>
            )}

            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1} alignItems="center">
                  {userSection}
                </Stack>
              </>
            )}
          </Box>
        </Drawer>
      </>
    )
  }

  // Desktop

  return (
    <AppBar position="sticky" color="default">
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
              {dormitoryActions}
              <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
            </>
          )}
        </Stack>

        {/* Username + Logout */}
        <Stack alignItems="center">{userSection}</Stack>
      </Toolbar>
    </AppBar>
  )
}
