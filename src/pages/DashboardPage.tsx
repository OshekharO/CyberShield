import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MetricCard } from '../components/MetricCard'
import { Card } from '../components/ui/card'
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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Monitor scan activity and risk posture at a glance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total scans" value={history.length} />
        <MetricCard label="High risk" value={metrics.high} />
        <MetricCard label="Critical" value={metrics.critical} />
        <MetricCard label="Average score" value={metrics.avg} />
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Risk analytics</h3>
        <div className="mt-4 h-72 min-w-0 overflow-x-auto">
          <div className="h-full min-w-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="target" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="score" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  )
}
