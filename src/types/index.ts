export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export type ScanType = 'ip' | 'url' | 'email' | 'domain'

export interface ScanResponse {
  scan_id: string
  target: string
  type: ScanType
  risk: {
    score: number
    level: string
    matched_rules: string[]
    provider_confidence?: number
  }
  signals: Record<string, unknown>
  providers: Record<string, unknown>
}
