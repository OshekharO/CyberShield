import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('cyber-card', className)} {...props}>
      {children}
    </div>
  )
}
