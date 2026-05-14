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
    <div className="space-y-4">
      <HUDHeader title="Scan Center" subtitle="Run IOC scans and receive contextual analyst summaries." glitch />

      <SurfacePanel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_minmax(0,1fr)_180px] md:items-center">
          <CyberSelect value={type} onChange={(e) => setType(e.target.value as ScanType)}>
            {scanTypes.map((scanType) => (
              <option key={scanType} value={scanType}>
                {scanType.toUpperCase()} scanner
              </option>
            ))}
          </CyberSelect>
          <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Enter IOC target..." />
          <Button className="w-full md:w-auto" onClick={run} disabled={loading || !target.trim()}>
            {loading ? 'Scanning...' : 'Run scan'}
          </Button>
        </div>
        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
      </SurfacePanel>

      {summary && (
        <TerminalBlock>
          <p className="cyber-label">AI Summary</p>
          <p className="mt-2 text-sm text-[var(--text-1)]">{summary}</p>
        </TerminalBlock>
      )}

      <SurfacePanel>
        <h3 className="cyber-title text-base">Recent scans</h3>
        <div className="mt-4 space-y-2.5">
          {recent.map((scan) => (
            <DataRow
              key={scan.scan_id}
              title={`${scan.type.toUpperCase()} — ${scan.target}`}
              subtitle={`Risk score ${scan.risk.score}`}
              action={<StatusBadge tone={statusToneFromRisk(scan.risk.level)}>{scan.risk.level}</StatusBadge>}
            />
          ))}
        </div>
      </SurfacePanel>
    </div>
  )
}
