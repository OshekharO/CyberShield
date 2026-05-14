import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function TerminalBlock({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('terminal-block leading-7', className)} {...props} />
}
