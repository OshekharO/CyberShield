import { useCallback, useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Input } from '../components/ui/input'
import { CyberSelect } from '../components/ui/cyber-select'
import { HUDHeader } from '../components/ui/hud-header'
import { DataRow } from '../components/ui/data-row'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'
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
      setSummary(result.ai_summary ?? '')
    } catch {
      setError('Scan failed. Verify target format and API credentials.')
    } finally {
      setLoading(false)
    }
  }, [addResult, target, type])

  return (
    <div className="stack-4">
      <HUDHeader title="Scan Center" subtitle="Execute indicator analysis across IPs, domains, hashes, and URLs." />

      <SurfacePanel>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <CyberSelect value={type} onChange={(e) => setType(e.target.value as ScanType)}>
            {scanTypes.map((scanType) => (
              <option key={scanType} value={scanType}>
                {scanType.toUpperCase()} Indicator
              </option>
            ))}
          </CyberSelect>
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && target.trim() && !loading && run()}
            placeholder="Enter target IP, domain, URL, or email..."
          />
          <Button className="w-full" onClick={run} disabled={loading || !target.trim()}>
            {loading ? 'Analyzing Target...' : 'Execute Scan'}
          </Button>
        </div>
        {error && <p className="form-error mt-3">{error}</p>}
      </SurfacePanel>

      {summary && (
        <SurfacePanel>
          <div className="row-between" style={{ marginBottom: '0.5rem' }}>
            <p className="cyber-title" style={{ fontSize: '0.95rem' }}>AI Threat Intelligence Synthesis</p>
            <span className="live-tag brand">Gemini Analysis</span>
          </div>
          <p className="helper-text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{summary}</p>
        </SurfacePanel>
      )}

      <SurfacePanel>
        <div className="row-between" style={{ marginBottom: '0.75rem' }}>
          <h3 className="cyber-title" style={{ fontSize: '0.95rem' }}>
            Recent Analyst Scans
          </h3>
          <span className="helper-text">{recent.length} recent executions</span>
        </div>
        {recent.length > 0 ? (
          <div className="stack-2">
            {recent.map((scan) => (
              <DataRow
                key={scan.scan_id}
                title={`${scan.type.toUpperCase()}: ${scan.target}`}
                subtitle={`Calculated score: ${scan.risk.score}/100`}
                action={<StatusBadge tone={statusToneFromRisk(scan.risk.level)}>{scan.risk.level}</StatusBadge>}
              />
            ))}
          </div>
        ) : (
          <div className="terminal-block">
            <p className="helper-text">No scans in this session yet. Submit an indicator above to begin analysis.</p>
          </div>
        )}
      </SurfacePanel>
    </div>
  )
}
