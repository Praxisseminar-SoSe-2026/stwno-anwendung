import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Button,
  Divider,
} from '@mui/material'
import { useAnnouncements } from '../../hooks/useAnnouncements'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { EDITOR_ROLES } from '../../constants/roles.ts'
import { Loading } from '../../components/Loading.tsx'

export function IndexPage() {
  const { t } = useTranslation()
  const { announcements, loading, error } = useAnnouncements()
  const canCreate = useHasRole(EDITOR_ROLES)

  if (loading) return <Loading />
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Stack spacing={3} style={{ width: '50%', alignSelf: 'center' }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h1">{t('bulletinBoard.title')}</Typography>
        {canCreate && (
          <Button variant="contained" component={Link} to="/aushang/neu">
            {t('bulletinBoard.newAnnouncement')}
          </Button>
        )}
      </Stack>
      <Divider />
      {announcements.length === 0 && (
        <Typography>{t('bulletinBoard.empty')}</Typography>
      )}

      {announcements.map((a) => (
        <Card key={a.id} variant="outlined">
          <CardActionArea component={Link} to={`/aushang/${a.id}`}>
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
              {a.image_url && (
                <img src={a.image_url} style={{ maxWidth: '20%' }} />
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  )
}
