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
    <Tag className={cn('glitch-text', className)} data-text={text}>
      {children ?? text}
    </Tag>
  )
}
