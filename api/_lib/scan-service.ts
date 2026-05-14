import { type Prisma, ScanType } from '@prisma/client'
import { prisma } from './db.js'
import { generateThreatSummary } from './gemini.js'
import { logApiUsage } from './logger.js'
import { providers } from './providers.js'
import { calculateRisk } from './scoring.js'
import type { ScanPayload } from './types.js'

type VirusTotalStats = { malicious?: number; phishing?: number }

const isRecentDomain = (creationDate?: string | null) => {
  if (!creationDate) return false
  const created = new Date(creationDate).getTime()
  const threshold = Date.now() - 1000 * 60 * 60 * 24 * 90
  return created >= threshold
}

export const runScan = async (userId: string, type: ScanPayload['type'], target: string) => {
  const start = Date.now()
  let signals: Record<string, unknown> = {}
  let providerData: Record<string, unknown> = {}

  if (type === 'ip') {
    const [ipinfo, abuse, fidro] = await Promise.all([
      providers.ipinfo(target),
      providers.abuseIpdb(target),
      providers.fidroValidate(target, 'ip'),
    ])

    signals = {
      abuse_confidence: abuse?.abuseConfidenceScore ?? 0,
      vpn_proxy: Boolean(fidro?.vpn || fidro?.proxy || fidro?.tor),
      blacklist_hits: Number(abuse?.totalReports || 0) + Number(fidro?.bad_ip ? 1 : 0),
    }
    providerData = { ipinfo, abuseipdb: abuse, fidro }
  }

  if (type === 'url') {
    const [vt, destroy] = await Promise.all([
      providers.virusTotal(target),
      providers.destroyList(target),
    ])

    const vtStats =
      (vt?.data?.attributes?.stats as VirusTotalStats | undefined) ??
      (vt?.data?.attributes?.last_analysis_stats as VirusTotalStats | undefined) ??
      {}
    const vtMalicious = Number(vtStats.malicious || 0) + Number(vtStats.phishing || 0)
    const destroyListed = Boolean(destroy?.threat ?? destroy?.listed)

    signals = {
      blacklist_hits: Number(destroyListed ? 1 : 0),
    }
    providerData = { virustotal: vt, destroylist: destroy, vtMalicious }
  }

  if (type === 'email') {
    const [usercheck, emailrep, fidro] = await Promise.all([
      providers.userCheckEmail(target),
      providers.emailRep(target),
      providers.fidroValidate(target, 'email'),
    ])

    signals = {
      breach_count: Number(emailrep?.references || 0),
      blacklist_hits: Number(usercheck?.blocklisted ? 1 : 0),
    }
    providerData = { usercheck, emailrep, fidro }
  }

  if (type === 'domain') {
    const [rdap, whois, pulse, usercheck] = await Promise.all([
      providers.rdapDomain(target),
      providers.whoisXmlSubdomains(target),
      providers.pulsedive(target),
      providers.userCheckDomain(target),
    ])

    const creationDate =
      rdap?.events?.find?.((event: { eventAction?: string; eventDate?: string }) => event.eventAction === 'registration')
        ?.eventDate || null

    signals = {
      recent_domain: isRecentDomain(creationDate),
      blacklist_hits: Number(pulse?.risk || 0) > 2 ? 1 : 0,
    }
    providerData = { rdap, whoisxml: whois, pulsedive: pulse, usercheck, creationDate }
  }

  const risk = calculateRisk({
    abuseConfidence: Number(signals.abuse_confidence || 0),
    blacklistHits: Number(signals.blacklist_hits || 0),
    phishingIndicators: Number((providerData as { vtMalicious?: number }).vtMalicious || 0),
    disposableEmail: Boolean((providerData as { fidro?: { disposable_email?: boolean } }).fidro?.disposable_email),
    fidroRisk: Number((providerData as { fidro?: { risk_score?: number } }).fidro?.risk_score || 0),
    virusTotalMalicious: Number((providerData as { vtMalicious?: number }).vtMalicious || 0),
    recentDomain: Boolean(signals.recent_domain || false),
  })

  const scan = await prisma.scan.create({
    data: {
      userId,
      target,
      type: type.toUpperCase() as ScanType,
      riskScore: risk.score,
      riskLevel: risk.level.toUpperCase().replace(' ', '_') as
        | 'SAFE'
        | 'LOW_RISK'
        | 'MEDIUM_RISK'
        | 'HIGH_RISK'
        | 'CRITICAL',
      matchedRules: risk.matched_rules,
    },
  })

  const aiSummary = await generateThreatSummary({ target, type, risk, signals, providerData })

  await prisma.scanResult.create({
    data: {
      scanId: scan.id,
      signals: signals as Prisma.InputJsonValue,
      providers: providerData as Prisma.InputJsonValue,
      aiSummary,
      providerHealth: {
        providers: Object.keys(providerData),
        availableCount: Object.values(providerData).filter(Boolean).length,
      },
    },
  })

  await prisma.threatReport.create({
    data: {
      scanId: scan.id,
      userId,
      reportTitle: `${type.toUpperCase()} Threat Analysis for ${target}`,
      reportBody: aiSummary,
      mitigationSteps: [
        'Block or isolate high-risk indicators at perimeter controls',
        'Add IOC to SIEM watchlists and EDR block policies',
        'Perform follow-up investigation with packet/endpoint telemetry',
      ],
    },
  })

  await logApiUsage({
    endpoint: `/api/scan/${type}`,
    method: 'POST',
    statusCode: 200,
    latencyMs: Date.now() - start,
    requestMeta: { target, type },
  })

  return {
    scan_id: scan.id,
    target,
    type,
    risk,
    signals,
    providers: providerData,
  } satisfies ScanPayload
}
