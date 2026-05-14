import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { MetricCard } from '../components/MetricCard'
import { HUDHeader } from '../components/ui/hud-header'
import { SurfacePanel } from '../components/ui/surface-panel'
import { useScanStore } from '../store/scanStore'

export default function DashboardPage() {
  const { history } = useScanStore()

  const chartData = useMemo(
    () =>
      history.slice(0, 8).map((scan) => ({
        target: scan.target.slice(0, 12),
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

  return (
    <div className="space-y-4">
      <HUDHeader title="Dashboard" subtitle="Monitor scan activity and risk posture at a glance." glitch />

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Chip size="small" color="primary" label="Live analytics" />
        <Chip size="small" color="secondary" label="Risk scoring" />
      </Stack>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total scans" value={history.length} />
        <MetricCard label="High risk" value={metrics.high} />
        <MetricCard label="Critical" value={metrics.critical} />
        <MetricCard label="Average score" value={metrics.avg} />
      </div>

      <SurfacePanel>
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
                <Bar dataKey="score" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SurfacePanel>
    </div>
  )
}
