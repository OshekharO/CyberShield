import { memo, useMemo, useState } from 'react'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'
import { SurfacePanel } from '../components/ui/surface-panel'
import { Input } from '../components/ui/input'
import { HUDHeader } from '../components/ui/hud-header'
import { DataRow } from '../components/ui/data-row'
import { StatusBadge } from '../components/ui/status-badge'
import { statusToneFromRisk } from '../components/ui/status-utils'

const ThreatItem = memo(function ThreatItem({ scan }: { scan: ScanResponse }) {
  return (
    <DataRow
      title={scan.target}
      subtitle={scan.type.toUpperCase()}
      action={<StatusBadge tone={statusToneFromRisk(scan.risk.level)}>{scan.risk.level}</StatusBadge>}
    />
  )
})

export default function ThreatFeedPage() {
  const { history } = useScanStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return history
    return history.filter((item) => item.target.toLowerCase().includes(q))
  }, [history, query])

  return (
    <SurfacePanel>
      <HUDHeader title="Threat Intelligence Feed" subtitle="Search and review historically triaged indicators across all vectors." />
      <Input className="mt-4" placeholder="Filter by indicator target, IP, domain, or email..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="stack-2 mt-4">
        {filtered.length > 0 ? (
          filtered.map((scan) => <ThreatItem key={scan.scan_id} scan={scan} />)
        ) : (
          <div className="terminal-block mt-2">
            <p className="helper-text">
              {history.length === 0
                ? 'No IOC scan history recorded yet. Run a scan in the Scan Center to populate the threat feed.'
                : 'No indicators matched your search query.'}
            </p>
          </div>
        )}
      </div>
    </SurfacePanel>
  )
}
