import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function TerminalBlock({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-box border border-base-300/60 bg-neutral p-4 text-sm text-neutral-content shadow-sm', className)} {...props} />
}
