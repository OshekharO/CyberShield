import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-300/70 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/75 dark:shadow-[0_20px_50px_-24px_rgba(8,47,73,0.8)]',
        className,
      )}
      {...props}
    />
  )
}
