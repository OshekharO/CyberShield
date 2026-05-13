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
      {label ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{label}</p> : null}
      {glitch ? <GlitchText as="h2" className="text-2xl font-semibold sm:text-3xl" text={title} /> : <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>}
      {subtitle ? <p className="max-w-3xl text-sm leading-6 text-base-content/70">{subtitle}</p> : null}
    </div>
  )
}
