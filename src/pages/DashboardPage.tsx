import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Radar, ScanSearch } from 'lucide-react'
import { MetricCard } from '../components/MetricCard'
import { HUDHeader } from '../components/ui/hud-header'
import { SurfacePanel } from '../components/ui/surface-panel'
import { DataRow } from '../components/ui/data-row'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'
import { useScanStore } from '../store/scanStore'

const quickActions = [
  {
    title: 'Run a new scan',
    desc: 'Launch IOC analysis with the guided scan flow.',
    to: '/scan-center',
    icon: ScanSearch,
  },
  {
    title: 'Review threat feed',
    desc: 'Inspect the latest suspicious indicators and risk labels.',
    to: '/threat-feed',
    icon: Radar,
  },
  {
    title: 'Export reports',
    desc: 'Download investigation-ready summaries for stakeholders.',
    to: '/reports',
    icon: FileText,
  },
]

export default function DashboardPage() {
  const { history } = useScanStore()

  const topFindings = useMemo(
    () => history.slice(0, 6).map((scan) => ({ target: scan.target, score: scan.risk.score, level: scan.risk.level, type: scan.type })),
    [history],
  )

  const metrics = useMemo(() => {
    const high = history.filter((scan) => scan.risk.score >= 65).length
    const critical = history.filter((scan) => scan.risk.score >= 85).length
    const avg = Math.round(history.reduce((sum, scan) => sum + scan.risk.score, 0) / Math.max(history.length, 1))
    return { high, critical, avg }
  }, [history])

  return (
    <div className="space-y-6">
      <HUDHeader title="Dashboard" subtitle="Track scan volume, monitor top findings, and understand overall risk posture at a glance." />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfacePanel className="mesh-bg space-y-4 p-6 lg:p-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Workspace status</p>
            <h2 className="text-3xl font-semibold">A calmer command center inspired by modern cyber tooling.</h2>
            <p className="max-w-2xl text-sm leading-7 text-base-content/70">
              Move between scanning, threat review, and reporting with a darker cyber look, clearer paneling, and stronger action cues.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.to} className="rounded-box border border-base-300/60 bg-base-100/70 p-4 transition hover:-translate-y-1 hover:border-primary/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-box bg-primary/15 text-primary">
                  <action.icon size={18} />
                </div>
                <h3 className="mt-4 font-semibold">{action.title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/65">{action.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Open <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </SurfacePanel>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard label="Total scans" value={history.length} helper="Stored recent investigations" />
          <MetricCard label="High risk" value={metrics.high} helper="Score at or above 65" />
          <MetricCard label="Critical" value={metrics.critical} helper="Score at or above 85" />
          <MetricCard label="Average score" value={metrics.avg} helper="Across the retained scan history" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfacePanel className="space-y-4">
          <HUDHeader title="Risk overview" subtitle="Recent indicators ordered by recency with simple, readable risk bars." />
          <div className="space-y-4">
            {topFindings.length > 0 ? (
              topFindings.map((finding) => (
                <div key={`${finding.type}-${finding.target}`} className="rounded-box border border-base-300/60 bg-base-200/45 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{finding.target}</p>
                      <p className="text-sm text-base-content/60">{finding.type.toUpperCase()} scan</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge tone={statusToneFromRisk(finding.level)}>{finding.level}</StatusBadge>
                      <span className="text-sm font-semibold">{finding.score}/100</span>
                    </div>
                  </div>
                  <progress className="progress progress-primary mt-3 w-full" value={finding.score} max="100" />
                </div>
              ))
            ) : (
              <div className="alert">Run your first scan to populate dashboard analytics.</div>
            )}
          </div>
        </SurfacePanel>

        <SurfacePanel className="space-y-4">
          <HUDHeader title="Recent activity" subtitle="The newest indicators entering the workflow." />
          <div className="space-y-3">
            {history.slice(0, 5).map((scan) => (
              <DataRow
                key={scan.scan_id}
                title={scan.target}
                subtitle={`${scan.type.toUpperCase()} · Risk score ${scan.risk.score}`}
                action={<StatusBadge tone={statusToneFromRisk(scan.risk.level)}>{scan.risk.level}</StatusBadge>}
              />
            ))}
            {history.length === 0 ? <div className="alert">No activity yet. Start scanning from Scan Center.</div> : null}
          </div>
        </SurfacePanel>
      </div>
    </div>
  )
}
