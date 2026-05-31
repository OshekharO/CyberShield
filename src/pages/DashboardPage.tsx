import { useMemo } from 'react'
import { Radar } from 'lucide-react'
import { MetricCard } from '../components/MetricCard'
import { HUDHeader } from '../components/ui/hud-header'
import { SurfacePanel } from '../components/ui/surface-panel'
import { useScanStore } from '../store/scanStore'

export default function DashboardPage() {
  const history = useScanStore((s) => s.history)

  const { metrics, levelCounts } = useMemo(() => {
    const buckets = { critical: 0, high: 0, medium: 0, low: 0, safe: 0 }
    let high = 0
    let critical = 0
    let total = 0

    for (const item of history) {
      total += item.risk.score
      if (item.risk.score >= 65) high += 1
      if (item.risk.score >= 85) critical += 1
      const level = item.risk.level.toLowerCase() as keyof typeof buckets
      if (level in buckets) buckets[level] += 1
    }

    return {
      metrics: {
        high,
        critical,
        avg: Math.round(total / Math.max(history.length, 1)),
      },
      levelCounts: buckets,
    }
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
    <div className="dashboard-grid">
      <SurfacePanel>
        <div className="panel-title-row">
          <HUDHeader title="Dashboard" subtitle="Monitor scan activity, risk trends, and recent intelligence updates." glitch />
          <div className="live-tags">
            <span className="live-tag brand">
              <Radar size={12} /> Live analytics
            </span>
            <span className="live-tag brand">Risk scoring</span>
          </div>
        </div>
      </SurfacePanel>

      <div className="dashboard-metrics">
        <MetricCard label="Total scans" value={history.length} />
        <MetricCard label="High risk" value={metrics.high} />
        <MetricCard label="Critical" value={metrics.critical} />
        <MetricCard label="Average score" value={metrics.avg} />
      </div>

      <div className="dashboard-panels">
        <SurfacePanel>
          <h3 className="cyber-title" style={{ fontSize: '1rem' }}>
            Risk distribution
          </h3>
          <div className="progress-list">
            {levelRows.map((row) => {
              const pct = Math.round((row.value / Math.max(history.length, 1)) * 100)
              return (
                <div className="progress-list-row" key={row.label}>
                  <div className="progress-list-meta">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                  <div className="progress-track" style={{ marginTop: 0 }}>
                    <div className="progress-bar" style={{ width: `${pct}%`, background: row.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </SurfacePanel>
      </div>

      <SurfacePanel>
        <h3 className="cyber-title" style={{ fontSize: '1rem' }}>
          Recent activity
        </h3>
        <div className="table-wrap">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Type</th>
                <th className="align-right">Score</th>
                <th className="align-right">Risk</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((scan) => (
                <tr key={scan.scan_id}>
                  <td>{scan.target}</td>
                  <td>{scan.type.toUpperCase()}</td>
                  <td className="align-right">{scan.risk.score}</td>
                  <td className="align-right" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    {scan.risk.level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfacePanel>
    </div>
  )
}
