export type StatusTone = 'safe' | 'low' | 'medium' | 'high' | 'critical' | 'default'

export function statusToneFromRisk(level?: string): StatusTone {
  const normalized = level?.toLowerCase()
  if (normalized === 'safe') return 'safe'
  if (normalized?.includes('low')) return 'low'
  if (normalized?.includes('medium')) return 'medium'
  if (normalized?.includes('high')) return 'high'
  if (normalized?.includes('critical')) return 'critical'
  return 'default'
}
