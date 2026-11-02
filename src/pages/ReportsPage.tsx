import { memo, useMemo } from 'react'
import {
  FileText,
  Download,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { reportService } from '../services/reportService'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Button } from '../components/ui/button'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'
import { Link } from 'react-router-dom'

const ReportRow = memo(function ReportRow({ scan }: { scan: ScanResponse }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/70 bg-card/50 hover:bg-card/90 transition-all gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
          <FileText size={20} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground break-all">
              {scan.target}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-muted text-muted-foreground border border-border">
              {scan.type}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Calendar size={11} /> Scan ID: {scan.scan_id.slice(0, 8)}
            </span>
            <span>•</span>
            <span>Risk Score: <strong className="text-foreground font-mono">{scan.risk.score}/100</strong></span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <StatusBadge tone={statusToneFromRisk(scan.risk.level)}>
          {scan.risk.level}
        </StatusBadge>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 border-border hover:bg-secondary"
          onClick={() => reportService.downloadReport(scan.scan_id)}
        >
          <Download size={13} />
          Export PDF
        </Button>
      </div>
    </div>
  )
})

export default function ReportsPage() {
  const { history } = useScanStore()
  const scans = useMemo(() => history, [history])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Compliance & Triage Reports</h1>
            <span className="hud-defcon-pill defcon-4">AUDIT READY</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Export certified threat intelligence dossiers with heuristic mitigation playbooks and multi-vendor logs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
            <ShieldCheck size={13} />
            Cryptographically Verifiable
          </span>
        </div>
      </div>

      <SurfacePanel className="cyber-card-elevated border-border/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Generated Intelligence Dossiers</h2>
            <p className="text-xs text-muted-foreground">
              Official triage reports available for export in SOC-2 / ISO-27001 compliant format
            </p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary font-mono text-secondary-foreground">
            {scans.length} Total Reports
          </span>
        </div>

        <div className="space-y-2.5">
          {scans.length > 0 ? (
            scans.map((scan) => <ReportRow key={scan.scan_id} scan={scan} />)
          ) : (
            <div className="p-8 text-center rounded-lg border border-dashed border-border/80 bg-background/50">
              <AlertCircle size={32} className="mx-auto text-muted-foreground/60 mb-2" />
              <h3 className="text-sm font-medium text-foreground">No Compliance Reports Available</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No scan reports have been recorded in this session. Execute an indicator scan in the Scan Center to generate intelligence reports.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Link to="/scan-center">
                  <Button size="sm" className="text-xs">
                    Go to Scan Center
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="sm" variant="outline" className="text-xs">
                    View Operations Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </SurfacePanel>

      {/* Audit note */}
      <div className="p-4 rounded-lg border border-border/60 bg-muted/20 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          <span>All reports are timestamped and signed with SHA-256 digests for legal chain of custody.</span>
        </div>
        <a href="#" className="font-medium text-foreground hover:underline inline-flex items-center gap-1">
          Verification Guidelines <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}
