import { cn } from '../../utils/cn'
import { GlitchText } from './glitch-text'

interface HUDHeaderProps {
  label?: string
  title: string
  subtitle?: string
  className?: string
  glitch?: boolean
}

export function HUDHeader({ label, title, subtitle, className, glitch = false }: HUDHeaderProps) {
  return (
    <div className={cn('stack-2', className)}>
      {label ? <p className="cyber-label">{label}</p> : null}
      {glitch ? <GlitchText as="h2" className="cyber-title" text={title} /> : <h2 className="cyber-title">{title}</h2>}
      {subtitle ? <p className="cyber-subtitle">{subtitle}</p> : null}
    </div>
  )
}
