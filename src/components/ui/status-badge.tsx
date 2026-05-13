import { cn } from '../../utils/cn'
import type { StatusTone } from './status-utils'

interface StatusBadgeProps {
  children: string
  tone?: StatusTone
  className?: string
}

const toneMap: Record<StatusTone, string> = {
  safe: 'badge-success',
  low: 'badge-info',
  medium: 'badge-warning',
  high: 'badge-warning',
  critical: 'badge-error',
  default: 'badge-primary',
}

export function StatusBadge({ children, tone = 'default', className }: StatusBadgeProps) {
  return <span className={cn('badge badge-sm border-none px-3 py-3 font-semibold uppercase tracking-[0.16em]', toneMap[tone], className)}>{children}</span>
}
