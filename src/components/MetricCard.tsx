import { memo } from 'react'
import { SurfacePanel } from './ui/surface-panel'

interface Props {
  label: string
  value: string | number
  helper?: string
}

function MetricCardBase({ label, value, helper }: Props) {
  return (
    <SurfacePanel className="space-y-2 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">{label}</p>
      <h3 className="text-3xl font-semibold text-base-content">{value}</h3>
      {helper ? <p className="text-sm text-base-content/60">{helper}</p> : null}
    </SurfacePanel>
  )
}

export const MetricCard = memo(MetricCardBase)
