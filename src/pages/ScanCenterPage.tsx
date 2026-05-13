import { useCallback, useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Input } from '../components/ui/input'
import { CyberSelect } from '../components/ui/cyber-select'
import { HUDHeader } from '../components/ui/hud-header'
import { DataRow } from '../components/ui/data-row'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'
import { TerminalBlock } from '../components/ui/terminal-block'
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
      <HUDHeader title="Scan Center" subtitle="Submit fresh indicators, review recent activity, and capture AI summaries in the same view." />

      <SurfacePanel className="space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
          <CyberSelect value={type} onChange={(e) => setType(e.target.value as ScanType)}>
            {scanTypes.map((scanType) => (
              <option key={scanType} value={scanType}>
                {scanType.toUpperCase()} scanner
              </option>
            ))}
          </CyberSelect>
          <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Enter IOC target..." />
          <Button onClick={run} disabled={loading || !target.trim()}>
            {loading ? 'Scanning...' : 'Run scan'}
          </Button>
        </div>
        {error ? <div className="alert alert-error text-sm">{error}</div> : null}
      </SurfacePanel>

      {summary ? (
        <TerminalBlock>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-content/70">AI summary</p>
          <p className="mt-2 leading-7">{summary}</p>
        </TerminalBlock>
      ) : null}

      <SurfacePanel className="space-y-4">
        <HUDHeader title="Recent scans" subtitle="The latest scan submissions and their assessed severity." />
        <div className="space-y-3">
          {recent.map((scan) => (
            <DataRow
              key={scan.scan_id}
              title={`${scan.type.toUpperCase()} · ${scan.target}`}
              subtitle={`Risk score ${scan.risk.score}`}
              action={<StatusBadge tone={statusToneFromRisk(scan.risk.level)}>{scan.risk.level}</StatusBadge>}
            />
          ))}
          {recent.length === 0 ? <div className="alert">Recent scan results will appear here once you run a scan.</div> : null}
        </div>
      </SurfacePanel>
    </div>
  )
}
