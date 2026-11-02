import type { ElementType, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GlitchTextProps {
  text: string
  as?: ElementType
  className?: string
  children?: ReactNode
}

export function GlitchText({ text, as: Tag = 'span', className, children }: GlitchTextProps) {
  return (
    <Tag className={cn('glitch-text font-semibold tracking-tight', className)}>
      {children ?? text}
    </Tag>
  )
}
