import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface DataRowProps {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}

export function DataRow({ title, subtitle, action, className }: DataRowProps) {
  return (
    <div className={cn('cyber-list-row flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="min-w-0">
        <p className="break-all text-sm font-semibold text-[var(--text-0)]">{title}</p>
        {subtitle ? <p className="mt-1 text-xs text-[var(--text-2)]">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
