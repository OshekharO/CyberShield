import { memo, useMemo, useState } from 'react'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'

const ThreatItem = memo(function ThreatItem({ scan }: { scan: ScanResponse }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="break-all text-sm font-medium text-slate-900 dark:text-slate-200">{scan.target}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {scan.type.toUpperCase()} • {scan.risk.level}
      </p>
    </div>
  )
})

export default function ThreatFeedPage() {
  const { history } = useScanStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => history.filter((item) => item.target.toLowerCase().includes(query.toLowerCase())),
    [history, query],
  )

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Threat Feed</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Search and review scanned indicators of compromise.</p>
      <Input className="mt-4" placeholder="Search IOC target" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="mt-4 space-y-2">
        {filtered.map((scan) => (
          <ThreatItem key={scan.scan_id} scan={scan} />
        ))}
      </div>
    </Card>
  )
}
