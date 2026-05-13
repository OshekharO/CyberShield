import { cn } from '../../utils/cn'
import type { StatusTone } from './status-utils'

interface StatusBadgeProps {
  children: string
  tone?: StatusTone
  className?: string
}

const toneMap: Record<StatusTone, string> = {
  safe: 'border-emerald-300/50 bg-emerald-400/15 text-emerald-200',
  low: 'border-sky-300/50 bg-sky-400/15 text-sky-200',
  medium: 'border-amber-300/50 bg-amber-400/15 text-amber-200',
  high: 'border-orange-300/50 bg-orange-400/15 text-orange-200',
  critical: 'border-rose-300/50 bg-rose-400/15 text-rose-200',
  default: 'border-cyan-300/40 bg-cyan-400/15 text-cyan-100',
}

export function StatusBadge({ children, tone = 'default', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] [clip-path:polygon(0.45rem_0,calc(100%-0.45rem)_0,100%_0.45rem,100%_calc(100%-0.45rem),calc(100%-0.45rem)_100%,0.45rem_100%,0_calc(100%-0.45rem),0_0.45rem)]',
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
