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

export const logApiUsage = async (input: LogInput) => {
  await prisma.apiLog.create({
    data: {
      endpoint: input.endpoint,
      method: input.method,
      statusCode: input.statusCode,
      providerName: input.providerName,
      latencyMs: input.latencyMs,
      requestMeta: input.requestMeta as Prisma.InputJsonValue | undefined,
    },
  })
}
