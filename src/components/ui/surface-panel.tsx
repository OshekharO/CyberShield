import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Card } from './card'

interface SurfacePanelProps extends HTMLAttributes<HTMLDivElement> {
  scanline?: boolean
}

export function SurfacePanel({ className, scanline = false, ...props }: SurfacePanelProps) {
  return (
    <Card
      className={cn(
        scanline &&
          'relative overflow-hidden before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent',
        className,
      )}
      {...props}
    />
  )
}
