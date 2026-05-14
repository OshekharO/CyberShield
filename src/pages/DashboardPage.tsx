import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import InsightsRounded from '@mui/icons-material/InsightsRounded'
import { MetricCard } from '../components/MetricCard'
import { HUDHeader } from '../components/ui/hud-header'
import { SurfacePanel } from '../components/ui/surface-panel'
import { useScanStore } from '../store/scanStore'

export default function DashboardPage() {
  const { history } = useScanStore()

  const chartData = useMemo(
    () =>
      history.slice(0, 8).map((scan) => ({
        target: scan.target.slice(0, 14),
        score: scan.risk.score,
      })),
    [history],
  )

  const metrics = useMemo(() => {
    const high = history.filter((scan) => scan.risk.score >= 65).length
    const critical = history.filter((scan) => scan.risk.score >= 85).length
    const avg = Math.round(history.reduce((sum, scan) => sum + scan.risk.score, 0) / Math.max(history.length, 1))
    return { high, critical, avg }
  }, [history])

  const levelCounts = useMemo(() => {
    const buckets = { critical: 0, high: 0, medium: 0, low: 0, safe: 0 }
    for (const item of history) {
      const level = item.risk.level.toLowerCase() as keyof typeof buckets
      if (level in buckets) buckets[level] += 1
    }
    return buckets
  }, [history])

  const levelRows = [
    { label: 'Critical', value: levelCounts.critical, color: '#e11d48' },
    { label: 'High', value: levelCounts.high, color: '#ea580c' },
    { label: 'Medium', value: levelCounts.medium, color: '#d97706' },
    { label: 'Low', value: levelCounts.low, color: '#0284c7' },
    { label: 'Safe', value: levelCounts.safe, color: '#10b981' },
  ]

  const recent = useMemo(() => history.slice(0, 6), [history])

  return (
    <div className="space-y-5">
      <SurfacePanel className="p-6 sm:p-7">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.5}>
          <HUDHeader title="Dashboard" subtitle="Monitor scan activity, risk trends, and recent intelligence updates." glitch />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip icon={<InsightsRounded fontSize="small" />} size="small" color="primary" label="Live analytics" />
            <Chip size="small" color="secondary" label="Risk scoring" />
          </Stack>
        </Stack>
      </SurfacePanel>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Total scans" value={history.length} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="High risk" value={metrics.high} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Critical" value={metrics.critical} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Average score" value={metrics.avg} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SurfacePanel className="p-6 sm:p-7">
            <Typography className="cyber-title text-base">Risk analytics</Typography>
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, metrics.avg))}
              sx={{ mt: 1.5, height: 8, borderRadius: 999, bgcolor: 'rgba(148,163,184,0.22)' }}
            />
            <div className="mt-4 h-72 min-w-0 overflow-x-auto">
              <div className="h-full min-w-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(109, 135, 173, 0.35)" />
                    <XAxis dataKey="target" stroke="rgba(155, 181, 219, 0.9)" />
                    <YAxis stroke="rgba(155, 181, 219, 0.9)" />
                    <Tooltip
                      cursor={{ fill: 'rgba(77, 234, 255, 0.08)' }}
                      contentStyle={{
                        border: '1px solid rgba(77, 234, 255, 0.45)',
                        borderRadius: '8px',
                        background: 'rgba(8, 14, 33, 0.92)',
                        color: '#e6efff',
                      }}
                    />
                    <Bar dataKey="score" fill="#38bdf8" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SurfacePanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <SurfacePanel className="h-full p-6 sm:p-7">
            <Typography className="cyber-title text-base">Risk distribution</Typography>
            <Stack spacing={1.4} sx={{ mt: 2 }}>
              {levelRows.map((row) => {
                const pct = Math.round((row.value / Math.max(history.length, 1)) * 100)
                return (
                  <Box key={row.label}>
                    <Stack direction="row" justifyContent="space-between" className="text-sm text-[var(--text-1)]">
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        mt: 0.6,
                        height: 7,
                        borderRadius: 999,
                        bgcolor: 'rgba(148,163,184,0.18)',
                        '& .MuiLinearProgress-bar': { backgroundColor: row.color },
                      }}
                    />
                  </Box>
                )
              })}
            </Stack>
          </SurfacePanel>
        </Grid>
      </Grid>

      <SurfacePanel className="overflow-hidden p-6 sm:p-7">
        <Typography className="cyber-title text-base">Recent activity</Typography>
        <Divider sx={{ my: 1.5 }} />
        <TableContainer className="rounded-xl border border-[var(--line)]">
          <Table
            size="small"
            sx={{
              '& .MuiTableCell-root': {
                px: { xs: 1.5, sm: 2 },
                py: 1.4,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Target</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Risk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((scan) => (
                <TableRow key={scan.scan_id} hover>
                  <TableCell sx={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scan.target}</TableCell>
                  <TableCell>{scan.type.toUpperCase()}</TableCell>
                  <TableCell align="right">{scan.risk.score}</TableCell>
                  <TableCell align="right" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    {scan.risk.level}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SurfacePanel>
    </div>
  )
}
