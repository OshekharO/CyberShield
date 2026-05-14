import type { VercelRequest, VercelResponse } from '@vercel/node'

export type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void>

export const allowMethods = (methods: string[], req: VercelRequest) => {
  if (!methods.includes(req.method || '')) {
    const err = new Error(`Method not allowed: ${req.method}`)
    ;(err as Error & { status?: number }).status = 405
    throw err
  }
}

export const sendJson = (res: VercelResponse, code: number, payload: unknown) => {
  res.status(code).json(payload)
}

export const setPrivateCache = (res: VercelResponse, maxAgeSeconds: number, staleWhileRevalidateSeconds = 0) => {
  const stalePart = staleWhileRevalidateSeconds > 0 ? `, stale-while-revalidate=${staleWhileRevalidateSeconds}` : ''
  res.setHeader('Cache-Control', `private, max-age=${maxAgeSeconds}${stalePart}`)
}

export const parsePagination = (req: VercelRequest, defaults = { page: 1, limit: 25, maxLimit: 100 }) => {
  const rawPage = Number(req.query.page)
  const rawLimit = Number(req.query.limit)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : defaults.page
  const limitCandidate = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : defaults.limit
  const limit = Math.min(limitCandidate, defaults.maxLimit)
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export const withErrorHandling = (handler: Handler): Handler => {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      const status = (error as Error & { status?: number }).status || 500
      res.status(status).json({
        error: (error as Error).message || 'Internal server error',
      })
    }
  }
}
