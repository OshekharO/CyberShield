import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MetricCard } from '../components/MetricCard'
import { useScanStore } from '../store/scanStore'

export default function DashboardPage() {
  const { history } = useScanStore()

  const chartData = useMemo(
    () =>
      history.slice(0, 8).map((s) => ({
        target: s.target.slice(0, 10),
        score: s.risk.score,
      })),
    [history],
  )

  const metrics = useMemo(() => {
    const high = history.filter((s) => s.risk.score >= 65).length
    const critical = history.filter((s) => s.risk.score >= 85).length
    const avg = Math.round(history.reduce((a, b) => a + b.risk.score, 0) / Math.max(history.length, 1))
    return { high, critical, avg }
  }, [history])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Scans" value={history.length} />
        <MetricCard label="High Risk" value={metrics.high} />
        <MetricCard label="Critical" value={metrics.critical} />
        <MetricCard label="Avg Score" value={metrics.avg} />
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
        <h2 className="mb-4 text-lg font-semibold text-cyan-300">Risk Analytics</h2>
        <div className="h-72 min-w-0 overflow-x-auto">
          <div className="h-full min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="target" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
