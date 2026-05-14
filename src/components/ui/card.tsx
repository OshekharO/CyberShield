import type { HTMLAttributes } from 'react'
import MuiCard from '@mui/material/Card'
import { cn } from '../../utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, children, ...props }: CardProps) {
  return (
    <MuiCard className={cn('cyber-card p-5 sm:p-6', className)} variant="outlined" elevation={0} {...props}>
      {children}
    </MuiCard>
  )
}
