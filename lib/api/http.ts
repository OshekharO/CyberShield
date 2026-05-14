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
