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
          <HUDHeader title="Operations Dashboard" subtitle="Live threat detection telemetry, risk distribution, and historical scans." />
          <div className="live-tags" style={{ marginTop: 0 }}>
            <span className="live-tag brand">
              <Radar size={13} /> Real-time Feed
            </span>
            <span className="live-tag">Automated Scoring</span>
          </div>
        </div>
      </SurfacePanel>

      <div className="dashboard-metrics">
        <MetricCard label="Total Scans Executed" value={history.length} />
        <MetricCard label="High Risk Detections" value={metrics.high} />
        <MetricCard label="Critical Threats" value={metrics.critical} />
        <MetricCard label="Average Risk Score" value={metrics.avg} />
      </div>

      <div className="dashboard-panels">
        <SurfacePanel>
          <div className="row-between" style={{ marginBottom: '0.75rem' }}>
            <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
              Risk Distribution Breakdown
            </h3>
            <span className="helper-text">{history.length} Total records</span>
          </div>
          <div className="progress-list">
            {levelRows.map((row) => {
              const pct = Math.round((row.value / Math.max(history.length, 1)) * 100)
              return (
                <div className="progress-list-row" key={row.label}>
                  <div className="progress-list-meta">
                    <span>{row.label}</span>
                    <span>{row.value} ({pct}%)</span>
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
        <div className="row-between" style={{ marginBottom: '0.5rem' }}>
          <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
            Recent Indicators
          </h3>
          <span className="helper-text">Latest {recent.length} scans</span>
        </div>
        {recent.length > 0 ? (
          <div className="table-wrap">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Indicator Target</th>
                  <th>Indicator Type</th>
                  <th className="align-right">Score</th>
                  <th className="align-right">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((scan) => (
                  <tr key={scan.scan_id}>
                    <td style={{ fontWeight: 500 }}>{scan.target}</td>
                    <td><span className="status-chip status-default">{scan.type.toUpperCase()}</span></td>
                    <td className="align-right">{scan.risk.score} / 100</td>
                    <td className="align-right">
                      <span className={`status-chip status-${scan.risk.level.toLowerCase().replace('_risk', '')}`}>
                        {scan.risk.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="terminal-block" style={{ marginTop: '0.75rem' }}>
            <p className="helper-text">No scans recorded yet. Initiate an indicator scan in Scan Center to see live telemetry.</p>
          </div>
        )}
      </SurfacePanel>
    </div>
  )
}
