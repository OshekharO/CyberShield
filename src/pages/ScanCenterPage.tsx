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
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-cyan-300">Scan Center</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[200px_minmax(0,1fr)_auto]">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ScanType)}
            className="rounded-xl border border-slate-700/60 bg-slate-900 p-2"
          >
            {scanTypes.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()} Scanner
              </option>
            ))}
          </select>
          <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Enter target..." />
          <Button onClick={run} disabled={loading || !target.trim()}>
            {loading ? 'Scanning...' : 'Run Scan'}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </Card>

      {summary && (
        <Card>
          <h3 className="font-semibold text-cyan-300">Gemini SOC Summary</h3>
          <p className="mt-2 break-words text-sm text-slate-300">{summary}</p>
        </Card>
      )}

      <Card>
        <h3 className="font-semibold text-cyan-300">Recent Scans</h3>
        <div className="mt-3 space-y-3">
          {recent.map((scan) => (
            <div key={scan.scan_id} className="rounded-xl border border-slate-700/60 p-3">
              <p className="break-all text-sm text-slate-200">
                {scan.type.toUpperCase()} - {scan.target}
              </p>
              <p className="text-xs text-slate-400">
                Risk {scan.risk.score} • {scan.risk.level}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
