import { useCallback, useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { scanService } from '../services/scanService'
import { useScanStore } from '../store/scanStore'
import type { ScanType } from '../types'

const scanTypes: ScanType[] = ['ip', 'url', 'email', 'domain']

export default function ScanCenterPage() {
  const [type, setType] = useState<ScanType>('ip')
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState('')
  const { addResult, history } = useScanStore()
  const recent = useMemo(() => history.slice(0, 8), [history])

  const run = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await scanService.runScan(type, target)
      addResult(result)
      const ai = await scanService.aiSummary(result)
      setSummary(ai.summary)
    } catch {
      setError('Scan failed. Verify target format and API credentials.')
    } finally {
      setLoading(false)
    }
  }, [addResult, target, type])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Scan Center</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Run IOC scans and receive contextual analyst summaries.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ScanType)}
            className="h-11 rounded-xl border border-slate-300/80 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            {scanTypes.map((scanType) => (
              <option key={scanType} value={scanType}>
                {scanType.toUpperCase()} scanner
              </option>
            ))}
          </select>
          <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Enter IOC target..." />
          <Button onClick={run} disabled={loading || !target.trim()}>
            {loading ? 'Scanning...' : 'Run scan'}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      </Card>

      {summary && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">AI summary</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{summary}</p>
        </Card>
      )}

      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent scans</h3>
        <div className="mt-3 space-y-2">
          {recent.map((scan) => (
            <div key={scan.scan_id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="break-all text-sm font-medium text-slate-900 dark:text-slate-200">
                {scan.type.toUpperCase()} — {scan.target}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Risk score {scan.risk.score} ({scan.risk.level})
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
