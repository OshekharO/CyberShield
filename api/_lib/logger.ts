import type { Prisma } from '@prisma/client'
import { prisma } from './db.js'

interface LogInput {
  endpoint: string
  method: string
  statusCode: number
  providerName?: string
  latencyMs: number
  requestMeta?: Record<string, unknown>
}

/**
 * ⚡ Bolt Optimization: Non-blocking API usage logging.
 *
 * Logging API usage metrics is a secondary operation that should not block or add
 * latency (~10–50ms) to critical scan and API request response paths.
 * We invoke the async database insertion without awaiting it directly, catching
 * any potential errors to ensure main API operations are resilient and fast.
 */
export const logApiUsage = async (input: LogInput) => {
  void prisma.apiLog
    .create({
      data: {
        endpoint: input.endpoint,
        method: input.method,
        statusCode: input.statusCode,
        providerName: input.providerName,
        latencyMs: input.latencyMs,
        requestMeta: input.requestMeta as Prisma.InputJsonValue | undefined,
      },
    })
    .catch((error) => {
      console.error('Failed to log API usage asynchronously:', error)
    })
}
