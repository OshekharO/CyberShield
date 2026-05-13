import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function TerminalBlock({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('terminal-block', className)} {...props} />
}
