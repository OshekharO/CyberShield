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
    <Tag className={cn('bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent', className)}>
      {children ?? text}
    </Tag>
  )
}
