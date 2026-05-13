import { memo, useMemo } from 'react'
import { reportService } from '../services/reportService'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'

const ReportRow = memo(function ReportRow({ scan }: { scan: ScanResponse }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="break-all text-sm sm:text-base">{scan.target}</p>
        <p className="text-xs text-slate-400">{scan.risk.level}</p>
      </div>
      <button className="text-sm text-cyan-300" onClick={() => reportService.downloadReport(scan.scan_id)}>
        Download PDF
      </button>
    </div>
  )
})

export default function ReportsPage() {
  const { history } = useScanStore()
  const scans = useMemo(() => history, [history])

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-cyan-300">Reports</h2>
      <div className="mt-4 space-y-2">
        {scans.map((scan) => (
          <ReportRow key={scan.scan_id} scan={scan} />
        ))}
      </div>
    </div>
  )
}
