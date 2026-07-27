import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useHealthCheck } from '../../hooks/useHealthCheck'
import HomeIcon from '@mui/icons-material/Home'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function IndexPage() {
  const { t } = useTranslation()
  const healthStatus = useHealthCheck()

  return (
    <Stack>
      <Stack direction="row">
        <HomeIcon />
        <Typography variant="h1">{t('index.title')}</Typography>
      </Stack>

      <Stack>
        <Typography>
          {t('healthcheck.desc')}
          {healthStatus === 'loading' && t('healthcheck.isLoading')}
          {healthStatus === 'online' && t('healthcheck.isAvailable')}
          {healthStatus === 'offline' && t('healthcheck.isNotAvailable')}
        </Typography>
        <Link to="/faq">{t('faq.title')}</Link>
        <Link to="/waschmaschinen">{t('laundry.title')}</Link>
        <Link to="/reparaturanfrage">{t('repairRequest.title')}</Link>
        <Link to="/gemeinschaftsraum">{t('roomBooking.title')}</Link>
      </Stack>
    </Stack>
  )
}
