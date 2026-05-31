import { type Prisma, ScanType } from '@prisma/client'
import { prisma } from './db.js'
import { generateThreatSummary } from './gemini.js'
import { logApiUsage } from './logger.js'
import { providers } from './providers.js'
import { calculateRisk } from './scoring.js'
import type { ScanPayload, RiskLevel } from './types.js'

type VirusTotalStats = { malicious?: number; phishing?: number }
const SCAN_CACHE_TTL_MS = 1000 * 60 * 15
const MAX_PROVIDER_SNAPSHOT_FIELDS = 12
type ProviderHealthSnapshot = { providers?: string[]; availableCount?: number } | null
type ProviderStatusPayload = { available?: boolean }

const formatRiskLevel = (level: ScanType | string): RiskLevel => {
  const normalized = String(level).toUpperCase()
  if (normalized === 'LOW_RISK') return 'Low Risk'
  if (normalized === 'MEDIUM_RISK') return 'Medium Risk'
  if (normalized === 'HIGH_RISK') return 'High Risk'
  if (normalized === 'CRITICAL') return 'Critical'
  if (normalized === 'SAFE') return 'Safe'
  return 'Safe'
}

const compactProviderData = (providerData: Record<string, unknown>) => {
  const compact: Record<string, unknown> = {}
  const providerEntries = Object.entries(providerData)

  for (const [provider, value] of providerEntries) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      compact[provider] = value
      continue
    }

    const primitiveSnapshot: Record<string, unknown> = {}
    const entries = Object.entries(value as Record<string, unknown>)
    for (const [key, entryValue] of entries) {
      if (Object.keys(primitiveSnapshot).length >= MAX_PROVIDER_SNAPSHOT_FIELDS) break
      if (entryValue === null) {
        primitiveSnapshot[key] = null
        continue
      }
      if (['string', 'number', 'boolean'].includes(typeof entryValue)) {
        primitiveSnapshot[key] = entryValue
        continue
      }
      if (Array.isArray(entryValue)) {
        primitiveSnapshot[key] = {
          count: entryValue.length,
          sample: entryValue.slice(0, 3).map((item) => (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' ? item : null)),
        }
      }
    }

    compact[provider] = primitiveSnapshot
  }

  return compact
}

const normalizeMatchedRules = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const getProviderHealth = (providerData: Record<string, unknown>) => {
  const providerEntries = Object.entries(providerData).filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value))
  const providers = providerEntries.map(([provider]) => provider)
  const availableCount = providerEntries.filter(([, value]) => (value as ProviderStatusPayload).available !== false).length
  return { providers, availableCount }
}

const isRecentDomain = (creationDate?: string | null) => {
  if (!creationDate) return false
  const created = new Date(creationDate).getTime()
  const threshold = Date.now() - 1000 * 60 * 60 * 24 * 90
  return created >= threshold
}

export const runScan = async (userId: string, type: ScanPayload['type'], target: string) => {
  const start = Date.now()

  const cachedScan = await prisma.scan.findFirst({
    where: {
      userId,
      target,
      type: type.toUpperCase() as ScanType,
      createdAt: {
        gte: new Date(Date.now() - SCAN_CACHE_TTL_MS),
      },
    },
    include: {
      results: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (cachedScan && cachedScan.results.length > 0) {
    const latestResult = cachedScan.results[0]
    const cachedProviderHealth = latestResult.providerHealth as ProviderHealthSnapshot
    const providerCount = Array.isArray(cachedProviderHealth?.providers) ? cachedProviderHealth.providers.length : 0
    const availableCount = typeof cachedProviderHealth?.availableCount === 'number' ? cachedProviderHealth.availableCount : 0
    const providerConfidence = providerCount > 0 ? Math.round((availableCount / providerCount) * 100) : 0
    await logApiUsage({
      endpoint: `/api/scan/${type}`,
      method: 'POST',
      statusCode: 200,
      latencyMs: Date.now() - start,
      requestMeta: { target, type, cached: true },
    })

    return {
      scan_id: cachedScan.id,
      target,
      type,
      risk: {
        score: cachedScan.riskScore,
        level: formatRiskLevel(cachedScan.riskLevel),
        matched_rules: normalizeMatchedRules(cachedScan.matchedRules),
        provider_confidence: providerConfidence,
      },
      signals: (latestResult.signals as Record<string, unknown>) || {},
      providers: (latestResult.providers as Record<string, unknown>) || {},
      ai_summary: latestResult.aiSummary || undefined,
    } satisfies ScanPayload
  }

  let signals: Record<string, unknown> = {}
  let providerData: Record<string, unknown> = {}

  if (type === 'ip') {
    const [ipinfo, abuse, fidro, antideo] = await Promise.all([
      providers.ipinfo(target),
      providers.abuseIpdb(target),
      providers.fidroValidate(target, 'ip'),
      providers.antideoIpHealth(target),
    ])
    const antideoHealth = (antideo as { health?: { proxy?: boolean; toxic?: boolean; spam?: boolean } })?.health

    signals = {
      abuse_confidence: abuse?.abuseConfidenceScore ?? 0,
      vpn_proxy: Boolean(fidro?.vpn || fidro?.proxy || fidro?.tor || antideoHealth?.proxy),
      blacklist_hits:
        Number(abuse?.totalReports || 0) +
        Number(fidro?.bad_ip ? 1 : 0) +
        Number(antideoHealth?.toxic || antideoHealth?.spam ? 1 : 0),
    }
    providerData = { ipinfo, abuseipdb: abuse, fidro, antideo }
  }

  if (type === 'url') {
    const [vt, destroy, ipqualityscore] = await Promise.all([
      providers.virusTotal(target),
      providers.destroyList(target),
      providers.ipQualityScoreUrl(target),
    ])

    const vtStats =
      (vt?.data?.attributes?.stats as VirusTotalStats | undefined) ??
      (vt?.data?.attributes?.last_analysis_stats as VirusTotalStats | undefined) ??
      {}
    const vtMalicious = Number(vtStats.malicious || 0) + Number(vtStats.phishing || 0)
    const destroyListed =
      typeof destroy?.threat === 'boolean'
        ? destroy.threat
        : typeof destroy?.listed === 'boolean'
          ? destroy.listed
          : false
    const ipqsUnsafe = Boolean(ipqualityscore?.unsafe)
    const ipqsThreatSignals = [ipqualityscore?.phishing, ipqualityscore?.malware, ipqualityscore?.suspicious, ipqualityscore?.spamming].filter(Boolean).length

    signals = {
      blacklist_hits: Number(destroyListed ? 1 : 0) + Number(ipqsUnsafe ? 1 : 0),
    }
    providerData = { virustotal: vt, destroylist: destroy, ipqualityscore, vtMalicious, ipqsThreatSignals }
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
    const pulseRiskRaw = typeof pulse?.risk === 'string' ? pulse.risk.trim().toLowerCase() : ''
    const pulseRisk = pulseRiskRaw === '' ? 'none' : pulseRiskRaw
    const pulseListed = pulseRisk === 'high' || pulseRisk === 'critical'

    signals = {
      recent_domain: isRecentDomain(creationDate),
      blacklist_hits: Number(pulseListed),
    }
    providerData = { rdap, whoisxml: whois, pulsedive: pulse, usercheck, creationDate }
  }

  const risk = calculateRisk({
    abuseConfidence: Number(signals.abuse_confidence || 0),
    blacklistHits: Number(signals.blacklist_hits || 0),
    phishingIndicators:
      Number((providerData as { vtMalicious?: number }).vtMalicious || 0) +
      Number((providerData as { ipqsThreatSignals?: number }).ipqsThreatSignals || 0),
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
      matchedRules: normalizeMatchedRules(risk.matched_rules),
    },
  })

  const aiSummary = await generateThreatSummary({ target, type, risk, signals, providerData })

  const providerHealth = getProviderHealth(providerData)

  await prisma.scanResult.create({
  data: {
    scanId: scan.id,
    signals: signals as Prisma.InputJsonValue,
    providers: compactProviderData(providerData) as Prisma.InputJsonValue,
    aiSummary,
    providerHealth,
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
    risk: {
      ...risk,
      matched_rules: normalizeMatchedRules(risk.matched_rules),
    },
    signals,
    providers: providerData,
    ai_summary: aiSummary,
  } satisfies ScanPayload
}
