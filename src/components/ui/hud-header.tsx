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
    <div className={cn('space-y-2', className)}>
      {label ? <p className="cyber-label">{label}</p> : null}
      {glitch ? <GlitchText as="h2" className="cyber-title text-2xl sm:text-3xl" text={title} /> : <h2 className="cyber-title text-2xl sm:text-3xl">{title}</h2>}
      {subtitle ? <p className="cyber-subtitle">{subtitle}</p> : null}
    </div>
  )
}
