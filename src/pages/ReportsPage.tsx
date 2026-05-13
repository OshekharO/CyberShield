import { memo, useMemo } from 'react'
import { reportService } from '../services/reportService'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Button } from '../components/ui/button'
import { HUDHeader } from '../components/ui/hud-header'
import { DataRow } from '../components/ui/data-row'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'

const ReportRow = memo(function ReportRow({ scan }: { scan: ScanResponse }) {
  return (
    <DataRow
      title={scan.target}
      subtitle={<StatusBadge tone={statusToneFromRisk(scan.risk.level)}>{scan.risk.level}</StatusBadge>}
      action={
        <Button variant="outline" size="sm" onClick={() => reportService.downloadReport(scan.scan_id)}>
          Download PDF
        </Button>
      }
    />
  )
})

export default function ReportsPage() {
  const { history } = useScanStore()
  const scans = useMemo(() => history, [history])

  return (
    <SurfacePanel className="space-y-4">
      <HUDHeader title="Reports" subtitle="Generate and download PDF reports from the findings already captured in your workspace." />
      <div className="space-y-3">
        {scans.map((scan) => (
          <ReportRow key={scan.scan_id} scan={scan} />
        ))}
        {scans.length === 0 ? <div className="alert">Run a scan to unlock exportable reports.</div> : null}
      </div>
    </SurfacePanel>
  )
}
