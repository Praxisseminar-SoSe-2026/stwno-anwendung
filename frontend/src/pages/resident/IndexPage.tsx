import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material'
import { useAnnouncements } from '../../hooks/useAnnouncements'

export function IndexPage() {
  const { t } = useTranslation()
  const { announcements, loading, error } = useAnnouncements()

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{t('login.invalid')}</Typography>

  return (
    <Stack spacing={2}>
      <Typography variant="h1">{t('bulletinBoard.title')}</Typography>

      {announcements.length === 0 && (
        <Typography>{t('bulletinBoard.empty')}</Typography>
      )}

      {announcements.map((a) => (
        <Card key={a.id} variant="outlined">
          <CardActionArea component={Link} to={`/aushang/${a.id}`}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4">{a.title}</Typography>
              <Typography variant="h6" color="text.secondary">
                {a.created_at && new Date(a.created_at).toLocaleDateString()}
              </Typography>
                  {a.important && (
                  <Chip
                    label={t('bulletinBoard.important')}
                    color="error"
                    size="small"
                  />
                )}
              </Stack>
                <Typography variant="body1" color="text.secondary">
                {a.text}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  )
}
