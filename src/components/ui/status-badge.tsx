import { cn } from '../../utils/cn'
import type { StatusTone } from './status-utils'

interface StatusBadgeProps {
  children: string
  tone?: StatusTone
  className?: string
}

const toneMap: Record<StatusTone, string> = {
  safe: 'border-emerald-400/40 bg-emerald-400/12 text-emerald-700 dark:text-emerald-200',
  low: 'border-sky-400/40 bg-sky-400/12 text-sky-700 dark:text-sky-200',
  medium: 'border-amber-400/45 bg-amber-400/12 text-amber-700 dark:text-amber-200',
  high: 'border-orange-400/45 bg-orange-400/12 text-orange-700 dark:text-orange-200',
  critical: 'border-rose-400/45 bg-rose-400/12 text-rose-700 dark:text-rose-200',
  default: 'border-slate-400/45 bg-slate-400/12 text-slate-700 dark:text-slate-200',
}

export function StatusBadge({ children, tone = 'default', className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]', toneMap[tone], className)}>
      {children}
    </span>
  )
}
