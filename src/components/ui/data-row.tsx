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
    <div className={cn('cyber-list-row', className)}>
      <div>
        <p className="cyber-title" style={{ fontSize: '0.95rem' }}>
          {title}
        </p>
        {subtitle ? (
          <p className="cyber-subtitle" style={{ marginTop: '0.25rem', fontSize: '0.88rem' }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
