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
    <div className={cn('flex flex-col gap-3 rounded-box border border-base-300/60 bg-base-200/50 p-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="min-w-0">
        <p className="break-all text-sm font-semibold text-base-content">{title}</p>
        {subtitle ? <div className="mt-1 text-xs text-base-content/60">{subtitle}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
