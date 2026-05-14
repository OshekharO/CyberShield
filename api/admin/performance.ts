import type { VercelRequest, VercelResponse } from '@vercel/node'
import { UserRole } from '@prisma/client'
import { allowMethods, setPrivateCache, withErrorHandling } from '../_lib/http.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { prisma } from '../_lib/db.js'

const percentile = (values: number[], pct: number) => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((pct / 100) * sorted.length) - 1))
  return sorted[index]
}

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  requireRole(UserRole.ADMIN, user.role)

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  const [logs, scanResults] = await Promise.all([
    prisma.apiLog.findMany({
      where: {
        createdAt: { gte: since },
        OR: [{ endpoint: { startsWith: '/api/scan/' } }, { endpoint: { startsWith: '/api/admin/' } }],
      },
      select: { endpoint: true, latencyMs: true, statusCode: true },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    }),
    prisma.scanResult.findMany({
      where: { createdAt: { gte: since } },
      select: { providerHealth: true },
      take: 5000,
    }),
  ])

  const scanLatency = logs.filter((log) => log.endpoint.startsWith('/api/scan/')).map((log) => log.latencyMs)
  const adminLatency = logs.filter((log) => log.endpoint.startsWith('/api/admin/')).map((log) => log.latencyMs)
  const scanErrors = logs.filter((log) => log.endpoint.startsWith('/api/scan/') && log.statusCode >= 400).length
  const adminErrors = logs.filter((log) => log.endpoint.startsWith('/api/admin/') && log.statusCode >= 400).length

  let monthlyExternalApiCalls = 0
  let providerUnavailableTotal = 0
  scanResults.forEach((result) => {
    const health = (result.providerHealth ?? {}) as {
      attemptedCount?: unknown
      availableCount?: unknown
      skippedProviders?: unknown
    }
    const attempted = Number(health.attemptedCount ?? 0)
    const available = Number(health.availableCount ?? 0)
    monthlyExternalApiCalls += attempted
    providerUnavailableTotal += Math.max(0, attempted - available)
  })

  const providerFailureRate = monthlyExternalApiCalls
    ? Number(((providerUnavailableTotal / monthlyExternalApiCalls) * 100).toFixed(2))
    : 0

  setPrivateCache(res, 20, 40)
  res.status(200).json({
    windowDays: 30,
    scanEndpoint: {
      count: scanLatency.length,
      p50Ms: percentile(scanLatency, 50),
      p95Ms: percentile(scanLatency, 95),
      errorRatePct: scanLatency.length ? Number(((scanErrors / scanLatency.length) * 100).toFixed(2)) : 0,
    },
    adminEndpoint: {
      count: adminLatency.length,
      p50Ms: percentile(adminLatency, 50),
      p95Ms: percentile(adminLatency, 95),
      errorRatePct: adminLatency.length ? Number(((adminErrors / adminLatency.length) * 100).toFixed(2)) : 0,
    },
    externalProviders: {
      monthlyCallCount: monthlyExternalApiCalls,
      failureRatePct: providerFailureRate,
    },
  })
})
