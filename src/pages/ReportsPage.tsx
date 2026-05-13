import { memo, useMemo } from 'react'
import { reportService } from '../services/reportService'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

const ReportRow = memo(function ReportRow({ scan }: { scan: ScanResponse }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/50">
      <div className="min-w-0">
        <p className="break-all text-sm font-medium text-slate-900 dark:text-slate-200">{scan.target}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{scan.risk.level}</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => reportService.downloadReport(scan.scan_id)}>
        Download PDF
      </Button>
    </div>
  )
})

export default function ReportsPage() {
  const { history } = useScanStore()
  const scans = useMemo(() => history, [history])

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Export detailed PDF reports from recorded scans.</p>
      <div className="mt-4 space-y-2">
        {scans.map((scan) => (
          <ReportRow key={scan.scan_id} scan={scan} />
        ))}
      </div>
    </Card>
  )
}
