import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Card } from './card'

interface SurfacePanelProps extends HTMLAttributes<HTMLDivElement> {
  scanline?: boolean
}

export function SurfacePanel({ className, scanline = false, ...props }: SurfacePanelProps) {
  return <Card className={cn(scanline && 'scanline-overlay', className)} {...props} />
}
