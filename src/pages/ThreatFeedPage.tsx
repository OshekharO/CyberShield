import { memo, useMemo, useState } from 'react'
import {
  Radio,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  Terminal,
  RefreshCw,
} from 'lucide-react'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'
import { Link } from 'react-router-dom'

const ThreatFeedItem = memo(function ThreatFeedItem({ scan }: { scan: ScanResponse }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border/70 bg-card/50 hover:bg-card/90 transition-all gap-3">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-secondary/80 flex items-center justify-center shrink-0 border border-border/80 text-muted-foreground">
          <Radio size={14} className="text-primary" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground break-all">
              {scan.target}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-muted text-muted-foreground border border-border">
              {scan.type}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-2">
            <span>Score: <strong className="text-foreground font-mono">{scan.risk.score}/100</strong></span>
            <span>•</span>
            <span className="font-mono text-[10px]">ID: {scan.scan_id.slice(0, 8)}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <StatusBadge tone={statusToneFromRisk(scan.risk.level)}>
          {scan.risk.level}
        </StatusBadge>
        <Link
          to="/dashboard"
          className="p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          title="View on Dashboard"
        >
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  )
})

export default function ThreatFeedPage() {
  const { history } = useScanStore()
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchesQuery = !query.trim() || item.target.toLowerCase().includes(query.trim().toLowerCase())
      const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase()
      return matchesQuery && matchesType
    })
  }, [history, query, filterType])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Live Threat Intelligence Feed</h1>
            <span className="hud-defcon-pill defcon-4">FEED SYNCED</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Search, inspect, and analyze incoming indicators of compromise (IoC) across all monitored vectors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/scan-center">
            <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-sm">
              <RefreshCw size={13} />
              Submit New Indicator
            </Button>
          </Link>
        </div>
      </div>

      <SurfacePanel className="cyber-card-elevated border-border/80 space-y-4">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 font-mono text-xs bg-background/80"
              placeholder="Filter by indicator target, IP address, domain, or URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground hidden sm:block" />
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/80 border border-border">
              {['all', 'ip', 'domain', 'url', 'email'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all uppercase font-mono ${
                    filterType === t
                      ? 'bg-background text-foreground shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Indicator list */}
        <div className="space-y-2 pt-2">
          {filtered.length > 0 ? (
            filtered.map((scan) => <ThreatFeedItem key={scan.scan_id} scan={scan} />)
          ) : (
            <div className="p-8 text-center rounded-lg border border-dashed border-border/80 bg-background/50">
              {history.length === 0 ? (
                <>
                  <ShieldAlert size={32} className="mx-auto text-muted-foreground/60 mb-2" />
                  <h3 className="text-sm font-medium text-foreground">No Threat Feed Data Recorded</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Indicator feed is empty. Visit the Scan Center or load sample telemetry from the operations dashboard to populate.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Link to="/scan-center">
                      <Button size="sm" variant="outline" className="text-xs">
                        Open Scan Center
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button size="sm" className="text-xs">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Terminal size={32} className="mx-auto text-muted-foreground/60 mb-2" />
                  <h3 className="text-sm font-medium text-foreground">No Matching Indicators Found</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try relaxing your search query or selecting "ALL" category.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 text-xs"
                    onClick={() => {
                      setQuery('')
                      setFilterType('all')
                    }}
                  >
                    Clear Filter
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </SurfacePanel>
    </div>
  )
}
