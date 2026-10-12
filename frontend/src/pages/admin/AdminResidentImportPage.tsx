import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
  importResidentMasterData,
  type ImportIssue,
  type ImportReport,
} from '../../api/residentImport.ts'

function IssueTable({
                      title,
                      issues,
                    }: {
  title: string
  issues: ImportIssue[]
}) {
  const { t } = useTranslation()

  if (issues.length === 0) return null

  return (
    <Stack spacing={1}>
      <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 100 }}>{t('residentImport.row')}</TableCell>
              <TableCell>{t('residentImport.message')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue, index) => (
              <TableRow key={`${issue.row_number}-${index}`}>
                <TableCell>{issue.row_number}</TableCell>
                <TableCell>{issue.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export function AdminResidentImportPage() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [report, setReport] = useState<ImportReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
    setReport(null)
    setError(null)
    // allows selecting the same file again after fixing it
    event.target.value = ''
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    setReport(null)
    setError(null)
    try {
      setReport(await importResidentMasterData(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : t('residentImport.failed'))
    } finally {
      setImporting(false)
    }
  }

  return (
    <Stack
      spacing={3}
      sx={{ width: { xs: '95%', md: '50%' }, alignSelf: 'center' }}
    >
      <Typography variant="h1">{t('residentImport.title')}</Typography>
      <Divider />

      <Typography>{t('residentImport.description')}</Typography>
      <Typography>{t('residentImport.columns')}</Typography>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFileIcon />}
          disabled={importing}
        >
          {t('residentImport.selectFile')}
          <input
            hidden
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
          />
        </Button>
        <Typography noWrap>{file?.name ?? t('residentImport.noFile')}</Typography>
      </Stack>

      <Button
        variant="contained"
        onClick={handleImport}
        disabled={!file || importing}
        startIcon={importing ? <CircularProgress size={18} /> : undefined}
        sx={{ alignSelf: 'flex-start' }}
      >
        {importing ? t('residentImport.importing') : t('residentImport.start')}
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {report && (
        <Stack spacing={2}>
          {report.success ? (
            <Alert severity="success">
              {t('residentImport.success', {
                created: report.created,
                updated: report.updated,
                unchanged: report.unchanged,
              })}
            </Alert>
          ) : (
            <Alert severity="error">
              {t('residentImport.aborted', { errorCount: report.errors.length })}
            </Alert>
          )}
          <IssueTable title={t('residentImport.errors')} issues={report.errors} />
          <IssueTable
            title={t('residentImport.warnings')}
            issues={report.warnings}
          />
        </Stack>
      )}
    </Stack>
  )
}