import { cn } from '../../utils/cn'
import type { StatusTone } from './status-utils'

interface StatusBadgeProps {
  children: string
  tone?: StatusTone
  className?: string
}

const toneClassMap: Record<StatusTone, string> = {
  safe: 'status-safe',
  low: 'status-low',
  medium: 'status-medium',
  high: 'status-high',
  critical: 'status-critical',
  default: 'status-default',
}

export function StatusBadge({ children, tone = 'default', className }: StatusBadgeProps) {
  return <span className={cn('status-chip', toneClassMap[tone], className)}>{children}</span>
}
