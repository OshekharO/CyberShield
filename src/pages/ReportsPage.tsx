import { reportService } from '../services/reportService'
import { useScanStore } from '../store/scanStore'

export default function ReportsPage() {
  const { history } = useScanStore()

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
      <h2 className="text-lg font-semibold text-cyan-300">Reports</h2>
      <div className="mt-4 space-y-2">
        {history.map((scan) => (
          <div key={scan.scan_id} className="flex items-center justify-between rounded-xl border border-slate-700/60 p-3">
            <div>
              <p>{scan.target}</p>
              <p className="text-xs text-slate-400">{scan.risk.level}</p>
            </div>
            <button className="text-sm text-cyan-300" onClick={() => reportService.downloadReport(scan.scan_id)}>
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
