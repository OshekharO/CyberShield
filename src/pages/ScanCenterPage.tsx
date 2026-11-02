import { useCallback, useMemo, useState } from 'react'
import {
  Search,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Input } from '../components/ui/input'
import { CyberSelect } from '../components/ui/cyber-select'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'
import { scanService } from '../services/scanService'
import { useScanStore } from '../store/scanStore'
import type { ScanType } from '../types'

const scanTypes: ScanType[] = ['ip', 'domain', 'url', 'email']

const sampleIndicators: Record<ScanType, string[]> = {
  ip: ['198.51.100.42', '185.220.101.5', '8.8.8.8'],
  domain: ['evil-phish-portal.com', 'api.production-auth.net', 'github.com'],
  url: ['https://finance-auth-update.net/login', 'https://secure.bank-portal.ru', 'https://cloudflare.com'],
  email: ['phish-actor@compromised-host.xyz', 'security-alert@paypal-update.online', 'admin@example.org'],
}

export default function ScanCenterPage() {
  const [type, setType] = useState<ScanType>('ip')
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState('')
  const { addResult, history } = useScanStore()
  const recent = useMemo(() => history.slice(0, 10), [history])

  const run = useCallback(async (targetOverride?: string) => {
    const toScan = (targetOverride ?? target).trim()
    if (!toScan) return
    setLoading(true)
    setError('')
    try {
      const result = await scanService.runScan(type, toScan)
      addResult(result)
      setSummary(result.ai_summary ?? '')
    } catch {
      setError('Scan failed. Verify target indicator format and network reachability.')
    } finally {
      setLoading(false)
    }
  }, [addResult, target, type])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Indicator Scan Center</h1>
            <span className="hud-defcon-pill defcon-4">READY</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-vector threat intelligence scan orchestration across IPs, domains, URLs, and emails.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Engines Online
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
            <Zap size={12} /> Real-time Enrichment
          </span>
        </div>
      </div>

      {/* Target Input Card */}
      <SurfacePanel className="cyber-card-elevated border-border/80 shadow-md">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          <Search size={14} className="text-primary" />
          <span>Configure & Launch Target Analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Indicator Type</label>
            <CyberSelect
              value={type}
              onChange={(e) => {
                setType(e.target.value as ScanType)
                setTarget('')
              }}
              className="w-full h-10 font-mono text-sm bg-background border-border"
            >
              {scanTypes.map((scanType) => (
                <option key={scanType} value={scanType}>
                  {scanType.toUpperCase()} Indicator
                </option>
              ))}
            </CyberSelect>
          </div>

          <div className="md:col-span-6">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Target String or Endpoint</label>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && target.trim() && !loading && run()}
              placeholder={`e.g. ${sampleIndicators[type][0]}`}
              className="w-full h-10 font-mono text-sm bg-background border-border placeholder:font-sans"
            />
          </div>

          <div className="md:col-span-3 md:self-end">
            <Button
              className="w-full h-10 text-sm font-semibold shadow-sm"
              onClick={() => run()}
              disabled={loading || !target.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap size={15} /> Execute Analysis
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Sample Indicators */}
        <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Quick Load:</span>
          {sampleIndicators[type].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTarget(sample)
                run(sample)
              }}
              className="px-2 py-1 rounded bg-secondary/80 hover:bg-secondary text-secondary-foreground font-mono text-[11px] transition-colors"
            >
              + {sample}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </SurfacePanel>

      {/* AI Threat Summary if available */}
      {summary && (
        <SurfacePanel className="cyber-card-elevated border-primary/30 bg-primary/[0.02]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">AI Threat Intelligence Synthesis</h2>
            </div>
            <span className="stat-metric-badge font-mono text-[10px] bg-primary/10 text-primary border border-primary/20">
              Heuristic Engine v2.4
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap font-sans">
            {summary}
          </p>
        </SurfacePanel>
      )}

      {/* Recent Scans Ledger */}
      <SurfacePanel className="cyber-card-elevated border-border/80">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/60">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Analyst Scan History</h2>
            <p className="text-xs text-muted-foreground">Recent indicator triage executions during this session</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary font-mono text-secondary-foreground">
            {recent.length} Recorded
          </span>
        </div>

        {recent.length > 0 ? (
          <div className="space-y-2">
            {recent.map((scan) => (
              <div
                key={scan.scan_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-card/90 transition-colors gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-foreground border border-border">
                      {scan.type.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs font-semibold text-foreground break-all">
                      {scan.target}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Threat Score: <span className="font-mono font-medium text-foreground">{scan.risk.score}/100</span> • Scan ID: <span className="font-mono">{scan.scan_id.slice(0, 8)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge tone={statusToneFromRisk(scan.risk.level)}>
                    {scan.risk.level}
                  </StatusBadge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => {
                      if (scan.ai_summary) setSummary(scan.ai_summary)
                    }}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-lg border border-dashed border-border/80 bg-background/50">
            <Terminal size={32} className="mx-auto text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-medium text-foreground">No IOC Scans Recorded</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Execute a target scan or pick one of the quick samples above to begin populating real-time telemetry.
            </p>
          </div>
        )}
      </SurfacePanel>

      {/* Trust & Methodology Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/40">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>Reputation queries verify against active DNS, BGP routing, and IP blocklists.</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/40">
          <CheckCircle2 size={16} className="text-primary shrink-0" />
          <span>Zero external tracking of queried indicators for data privacy compliance.</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/40">
          <Zap size={16} className="text-amber-500 shrink-0" />
          <span>Sub-second deterministic scoring powered by edge sensor pipelines.</span>
        </div>
      </div>
    </div>
  )
}
