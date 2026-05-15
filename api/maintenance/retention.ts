import { UserRole } from '@prisma/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/db.js'
import { requireAuth, requireRole } from '../_lib/guards.js'
import { allowMethods, withErrorHandling } from '../_lib/http.js'

const DEFAULT_API_LOG_RETENTION_DAYS = 30
const DEFAULT_SCAN_RESULT_RETENTION_DAYS = 30
const MIN_RETENTION_DAYS = 1
const MAX_RETENTION_DAYS = 3650

const parseRetentionDays = (raw: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(String(raw ?? ''), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(MAX_RETENTION_DAYS, Math.max(MIN_RETENTION_DAYS, parsed))
}

const hasValidCronSecret = (req: VercelRequest) => {
  const secret = process.env.CRON_SECRET ?? process.env.RETENTION_CRON_SECRET
  if (!secret) return false
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return false
  const provided = header.slice('Bearer '.length).trim()
  return provided.length > 0 && provided === secret
}

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)

  const authorizedByCron = hasValidCronSecret(req)
  if (!authorizedByCron) {
    const user = await requireAuth(req)
    requireRole(UserRole.ADMIN, user.role)
  }

  // Invalid or missing values fall back to defaults and are clamped to a safe range.
  const apiLogRetentionDays = parseRetentionDays(
    process.env.API_LOG_RETENTION_DAYS,
    DEFAULT_API_LOG_RETENTION_DAYS,
  )
  const scanResultRetentionDays = parseRetentionDays(
    process.env.SCAN_RESULT_RETENTION_DAYS,
    DEFAULT_SCAN_RESULT_RETENTION_DAYS,
  )

  const now = Date.now()
  const apiLogCutoff = new Date(now - apiLogRetentionDays * 24 * 60 * 60 * 1000)
  const scanResultCutoff = new Date(now - scanResultRetentionDays * 24 * 60 * 60 * 1000)

  const [apiLogResult, scanResultResult] = await prisma.$transaction([
    prisma.apiLog.deleteMany({
      where: { createdAt: { lt: apiLogCutoff } },
    }),
    prisma.scanResult.deleteMany({
      where: { createdAt: { lt: scanResultCutoff } },
    }),
  ])

  res.status(200).json({
    deleted: {
      apiLogs: apiLogResult.count,
      scanResults: scanResultResult.count,
    },
    retentionDays: {
      apiLogs: apiLogRetentionDays,
      scanResults: scanResultRetentionDays,
    },
    cutoff: {
      apiLogs: apiLogCutoff.toISOString(),
      scanResults: scanResultCutoff.toISOString(),
    },
    triggeredBy: authorizedByCron ? 'cron' : 'admin',
  })
})
