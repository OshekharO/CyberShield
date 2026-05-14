import Chip from '@mui/material/Chip'
import { cn } from '../../utils/cn'
import type { StatusTone } from './status-utils'

interface StatusBadgeProps {
  children: string
  tone?: StatusTone
  className?: string
}

const toneMap: Record<StatusTone, { bg: string; color: string; border: string }> = {
  safe: { bg: 'rgba(16,185,129,0.14)', color: '#10b981', border: 'rgba(16,185,129,0.38)' },
  low: { bg: 'rgba(56,189,248,0.14)', color: '#0ea5e9', border: 'rgba(56,189,248,0.38)' },
  medium: { bg: 'rgba(245,158,11,0.14)', color: '#d97706', border: 'rgba(245,158,11,0.38)' },
  high: { bg: 'rgba(249,115,22,0.14)', color: '#ea580c', border: 'rgba(249,115,22,0.38)' },
  critical: { bg: 'rgba(244,63,94,0.14)', color: '#e11d48', border: 'rgba(244,63,94,0.38)' },
  default: { bg: 'rgba(100,116,139,0.14)', color: '#475569', border: 'rgba(100,116,139,0.38)' },
}

export function StatusBadge({ children, tone = 'default', className }: StatusBadgeProps) {
  const colors = toneMap[tone]

  return (
    <Chip
      size="small"
      label={children}
      className={cn(className)}
      sx={{
        height: 24,
        fontWeight: 700,
        letterSpacing: '0.11em',
        textTransform: 'uppercase',
        borderRadius: '999px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        color: colors.color,
      }}
    />
  )
}
