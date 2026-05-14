import { type Prisma, ScanType } from '@prisma/client'
import { prisma } from './db.js'
import { generateThreatSummary } from './gemini.js'
import { logApiUsage } from './logger.js'
import { providers } from './providers.js'
import { calculateRisk } from './scoring.js'
import type { ScanPayload } from './types.js'

const extractUrlId = (url: string) => Buffer.from(url).toString('base64url')
const normalizeTarget = (value: string) => value.trim().toLowerCase()

const USER_RATE_WINDOW_MS = 1000 * 60
const USER_RATE_MAX_SCANS = 6
const TARGET_COOLDOWN_MS = 1000 * 30
const PROVIDER_STAGE_BUDGET_MS = 8500

const userRateWindow = new Map<string, number[]>()
const targetCooldown = new Map<string, number>()
const inFlightScans = new Map<string, Promise<ScanPayload & { ai_summary: string }>>()

const isRecentDomain = (creationDate?: string | null) => {
  if (!creationDate) return false
  const created = new Date(creationDate).getTime()
  const threshold = Date.now() - 1000 * 60 * 60 * 24 * 90
  return created >= threshold
}

const withTimeBudget = async <T>(task: () => Promise<T>, timeoutMs: number, fallback: T): Promise<T> => {
  return Promise.race([
    task(),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), timeoutMs)
    }),
  ])
}

const enforceScanLimits = (userId: string, type: ScanPayload['type'], target: string) => {
  const now = Date.now()

  const history = userRateWindow.get(userId) ?? []
  const recent = history.filter((timestamp) => now - timestamp < USER_RATE_WINDOW_MS)
  if (recent.length >= USER_RATE_MAX_SCANS) {
    const err = new Error('Rate limit exceeded. Please wait before running more scans.')
    ;(err as Error & { status?: number }).status = 429
    throw err
  }
  recent.push(now)
  userRateWindow.set(userId, recent)

  const cooldownKey = `${userId}:${type}:${normalizeTarget(target)}`
  const nextAllowedAt = targetCooldown.get(cooldownKey) ?? 0
  if (nextAllowedAt > now) {
    const retrySeconds = Math.ceil((nextAllowedAt - now) / 1000)
    const err = new Error(`Cooldown active for this target. Try again in ${retrySeconds}s.`)
    ;(err as Error & { status?: number }).status = 429
    throw err
  }
  targetCooldown.set(cooldownKey, now + TARGET_COOLDOWN_MS)
}

const executeScan = async (userId: string, type: ScanPayload['type'], target: string) => {
  enforceScanLimits(userId, type, target)

  const start = Date.now()
  let signals: Record<string, unknown> = {}
  let providerData: Record<string, unknown> = {}
  let attemptedProviders: string[] = []
  let skippedProviders: string[] = []
  let virusTotalMalicious = 0

  if (type === 'ip') {
    attemptedProviders = ['abuseipdb', 'fidro', 'ipinfo']
    const [abuse, fidro] = await withTimeBudget(
      () => Promise.all([providers.abuseIpdb(target), providers.fidroValidate(target, 'ip')]),
      PROVIDER_STAGE_BUDGET_MS,
      [null, null] as const,
    )

    const skipIpInfo =
      Number(abuse?.abuseConfidenceScore || 0) >= 75 ||
      Number(fidro?.risk_score || 0) >= 80 ||
      Boolean(fidro?.bad_ip)
    const ipinfo = skipIpInfo ? null : await withTimeBudget(() => providers.ipinfo(target), 4000, null)
    if (skipIpInfo) skippedProviders.push('ipinfo')

    signals = {
      abuse_confidence: abuse?.abuseConfidenceScore ?? 0,
      vpn_proxy: Boolean(fidro?.vpn || fidro?.proxy || fidro?.tor),
      blacklist_hits: Number(abuse?.totalReports || 0) + Number(fidro?.bad_ip ? 1 : 0),
    }
    providerData = Object.fromEntries(
      Object.entries({ ipinfo, abuseipdb: abuse, fidro }).filter(([, value]) => value !== null),
    )
  }

  if (type === 'url') {
    attemptedProviders = ['virustotal', 'urlhaus', 'destroylist']
    const [vt, urlhaus] = await withTimeBudget(
      () => Promise.all([providers.virusTotal(extractUrlId(target)), providers.urlHaus(target)]),
      PROVIDER_STAGE_BUDGET_MS,
      [null, null] as const,
    )

    virusTotalMalicious =
      Number(vt?.data?.attributes?.last_analysis_stats?.malicious || 0) +
      Number(vt?.data?.attributes?.last_analysis_stats?.phishing || 0)
    const skipDestroyList = virusTotalMalicious >= 3 || urlhaus?.url_status === 'online'
    const destroy = skipDestroyList ? null : await withTimeBudget(() => providers.destroyList(target), 4000, null)
    if (skipDestroyList) skippedProviders.push('destroylist')

    signals = {
      blacklist_hits: Number(urlhaus?.url_status === 'online' ? 1 : 0) + Number(destroy?.listed ? 1 : 0),
    }
    providerData = Object.fromEntries(
      Object.entries({ virustotal: vt, urlhaus, destroylist: destroy }).filter(([, value]) => value !== null),
    )
  }

  if (type === 'email') {
    attemptedProviders = ['usercheck', 'emailrep', 'fidro']
    const [usercheck, emailrep, fidro] = await withTimeBudget(
      () => Promise.all([providers.userCheckEmail(target), providers.emailRep(target), providers.fidroValidate(target, 'email')]),
      PROVIDER_STAGE_BUDGET_MS,
      [null, null, null] as const,
    )

    signals = {
      breach_count: Number(emailrep?.references || 0),
      blacklist_hits: Number(usercheck?.blocklisted ? 1 : 0),
    }
    providerData = Object.fromEntries(
      Object.entries({ usercheck, emailrep, fidro }).filter(([, value]) => value !== null),
    )
  }

  if (type === 'domain') {
    attemptedProviders = ['rdap', 'pulsedive', 'usercheck', 'whoisxml']
    const [rdap, pulse, usercheck] = await withTimeBudget(
      () => Promise.all([providers.rdapDomain(target), providers.pulsedive(target), providers.userCheckDomain(target)]),
      PROVIDER_STAGE_BUDGET_MS,
      [null, null, null] as const,
    )
    const skipWhois = Number(pulse?.risk || 0) >= 3 || Boolean(usercheck?.blocklisted)
    const whois = skipWhois ? null : await withTimeBudget(() => providers.whoisXmlSubdomains(target), 4000, null)
    if (skipWhois) skippedProviders.push('whoisxml')

    const creationDate =
      rdap?.events?.find?.((event: { eventAction?: string; eventDate?: string }) => event.eventAction === 'registration')
        ?.eventDate || null

    signals = {
      recent_domain: isRecentDomain(creationDate),
      blacklist_hits: Number(pulse?.risk || 0) > 2 ? 1 : 0,
    }
    providerData = Object.fromEntries(
      Object.entries({ rdap, whoisxml: whois, pulsedive: pulse, usercheck, creationDate }).filter(([, value]) => value !== null),
    )
  }

  const risk = calculateRisk({
    abuseConfidence: Number(signals.abuse_confidence || 0),
    blacklistHits: Number(signals.blacklist_hits || 0),
    phishingIndicators: virusTotalMalicious,
    disposableEmail: Boolean((providerData as { fidro?: { disposable_email?: boolean } }).fidro?.disposable_email),
    fidroRisk: Number((providerData as { fidro?: { risk_score?: number } }).fidro?.risk_score || 0),
    virusTotalMalicious,
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
        providers: attemptedProviders,
        skippedProviders,
        attemptedCount: attemptedProviders.length,
        availableCount: Object.values(providerData).filter((value) => value !== null).length,
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
    requestMeta: {
      target,
      type,
      providerAttempted: attemptedProviders.length,
      providerSkipped: skippedProviders.length,
      providerAvailable: Object.values(providerData).filter((value) => value !== null).length,
    },
  })

  return {
    scan_id: scan.id,
    target,
    type,
    risk,
    signals,
    providers: providerData,
    ai_summary: aiSummary,
  } satisfies ScanPayload & { ai_summary: string }
}

export const runScan = async (userId: string, type: ScanPayload['type'], target: string) => {
  const key = `${userId}:${type}:${normalizeTarget(target)}`
  const inFlight = inFlightScans.get(key)
  if (inFlight) {
    return inFlight
  }

  const promise = executeScan(userId, type, target).finally(() => {
    inFlightScans.delete(key)
  })
  inFlightScans.set(key, promise)
  return promise
}
