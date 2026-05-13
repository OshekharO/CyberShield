import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 shadow-glass backdrop-blur-md',
        className,
      )}
      {...props}
    />
  )
}
