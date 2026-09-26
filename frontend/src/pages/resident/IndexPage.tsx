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
import { useDormitories } from '../../hooks/useDormitories.ts'

export function IndexPage() {
  const { t } = useTranslation()
  const { announcements, loading, error } = useAnnouncements()
  const canCreate = useHasRole(EDITOR_ROLES)
  const { dormitories } = useDormitories()

  function dormitoryLabel(dormitoryId: number | null): string {
    if (dormitoryId === null) return t('bulletinBoard.scopeGlobal')
    return (
      dormitories.find((d) => d.id === dormitoryId)?.name ??
      t('bulletinBoard.scopeGlobal')
    )
  }

  if (loading) return <Loading />
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Stack
      spacing={3}
      sx={{ width: { xs: '100%', md: '50%' }, alignSelf: 'center' }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
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
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
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
                <Chip
                  label={dormitoryLabel(a.dormitory_id)}
                  color={a.dormitory_id === null ? 'default' : 'primary'}
                  size="small"
                />
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
