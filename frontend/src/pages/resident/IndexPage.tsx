import { Link } from 'react-router'
import { useHealthCheck } from '../../hooks/useHealthCheck'
import HomeIcon from '@mui/icons-material/Home'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function IndexPage() {
  const healthStatus = useHealthCheck()

  return (
    <Stack>
      <Stack direction="row">
        <HomeIcon />
        <Typography variant="h1">Startseite</Typography>
      </Stack>

      <Stack>
        <Typography>
          Das Backend {healthStatus === 'loading' && 'lädt.'}
          {healthStatus === 'online' && 'ist erreichbar.'}
          {healthStatus === 'offline' && 'ist nicht erreichbar'}
        </Typography>
        <Link to="/faq">FAQ</Link>
        <Link to="/waschmaschinen">Waschraum Übersicht</Link>
        <Link to="/reparaturanfrage">Neue Reparaturanfrage</Link>
        <Link to="/gemeinschaftsraum">Gemeinschaftsraum</Link>
      </Stack>
    </Stack>
  )
}
