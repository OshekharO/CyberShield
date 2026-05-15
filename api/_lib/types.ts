export type RiskLevel = 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical'

export type ScanType = 'ip' | 'url' | 'email' | 'domain'

export interface RiskAssessment {
  score: number
  level: RiskLevel
  matched_rules: string[]
  provider_confidence: number
}

export interface ScanPayload {
  scan_id: string
  target: string
  type: ScanType
  risk: RiskAssessment
  signals: Record<string, unknown>
  providers: Record<string, unknown>
  ai_summary?: string
}
