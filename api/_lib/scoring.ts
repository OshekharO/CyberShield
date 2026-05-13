import type { RiskAssessment } from './types'

interface ScoringInput {
  abuseConfidence?: number
  blacklistHits?: number
  phishingIndicators?: number
  disposableEmail?: boolean
  fidroRisk?: number
  virusTotalMalicious?: number
  recentDomain?: boolean
}

export const calculateRisk = (input: ScoringInput): RiskAssessment => {
  let score = 0
  const matched_rules: string[] = []

  if ((input.abuseConfidence || 0) >= 80) {
    score += 25
    matched_rules.push('high_abuse_confidence')
  }

  if ((input.blacklistHits || 0) > 0) {
    score += Math.min(20, (input.blacklistHits || 0) * 6)
    matched_rules.push('blacklist_match')
  }

  if ((input.phishingIndicators || 0) > 0) {
    score += Math.min(20, (input.phishingIndicators || 0) * 8)
    matched_rules.push('phishing_signal')
  }

  if (input.disposableEmail) {
    score += 12
    matched_rules.push('disposable_email')
  }

  if ((input.fidroRisk || 0) >= 70) {
    score += 20
    matched_rules.push('fidro_high_risk')
  }

  if ((input.virusTotalMalicious || 0) >= 3) {
    score += 18
    matched_rules.push('vt_malicious_detection')
  }

  if (input.recentDomain) {
    score += 15
    matched_rules.push('recent_domain_registration')
  }

  score = Math.max(0, Math.min(100, score))

  let level: RiskAssessment['level'] = 'Safe'
  if (score >= 85) level = 'Critical'
  else if (score >= 65) level = 'High Risk'
  else if (score >= 40) level = 'Medium Risk'
  else if (score >= 15) level = 'Low Risk'

  const provider_confidence = Math.min(100, Math.max(35, matched_rules.length * 20))

  return { score, level, matched_rules, provider_confidence }
}
