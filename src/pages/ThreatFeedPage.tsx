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

  const filtered = useMemo(() => history.filter((item) => item.target.toLowerCase().includes(query.toLowerCase())), [history, query])

  return (
    <SurfacePanel>
      <HUDHeader title="Threat Feed" subtitle="Search and review scanned indicators of compromise." glitch />
      <Input className="mt-4" placeholder="Search IOC target" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="stack-2 mt-4">
        {filtered.map((scan) => (
          <ThreatItem key={scan.scan_id} scan={scan} />
        ))}
      </div>
    </SurfacePanel>
  )
}
