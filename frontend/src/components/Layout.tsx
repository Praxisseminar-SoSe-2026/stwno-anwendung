import { Outlet } from 'react-router'
import { Stack } from '@mui/material'
import { Header } from './Header.tsx'

export function Layout() {
  return (
    <Stack>
      <Header />
      <Stack sx={{ m: 5 }}>
        <Outlet />
      </Stack>
    </Stack>
  )
}
