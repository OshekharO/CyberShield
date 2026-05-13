import { memo, useMemo, useState } from 'react'
import { useScanStore } from '../store/scanStore'
import type { ScanResponse } from '../types'

const ThreatItem = memo(function ThreatItem({ scan }: { scan: ScanResponse }) {
  return (
    <div className="rounded-xl border border-slate-700/60 p-3 text-sm">
      <p className="break-all">{scan.target}</p>
      <p className="text-xs text-slate-400">
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
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-cyan-300">Threat Feed</h2>
      <input
        className="mt-3 w-full rounded-xl border border-slate-700/60 bg-slate-900 px-3 py-2"
        placeholder="Search IOC"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-4 space-y-2">
        {filtered.map((scan) => (
          <ThreatItem key={scan.scan_id} scan={scan} />
        ))}
      </div>
    </div>
  )
}
