import { memo } from 'react'
import { TrendingUp } from 'lucide-react'
import { SurfacePanel } from './ui/surface-panel'

interface Props {
  label: string
  value: string | number
}

function MetricCardBase({ label, value }: Props) {
  return (
    <SurfacePanel>
      <div className="metric-card-head">
        <p className="cyber-label">{label}</p>
        <TrendingUp size={16} className="icon-muted" />
      </div>
      <p className="metric-value">{value}</p>
    </SurfacePanel>
  )
}

export const MetricCard = memo(MetricCardBase)
