import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { allowMethods, withErrorHandling } from './_lib/http.js'
import { requireAuth } from './_lib/guards.js'
import { prisma } from './_lib/db.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  allowMethods(['GET'], req)
  const user = await requireAuth(req)
  const scanId = String(req.query.scanId || '')

  if (!scanId) {
    res.status(400).json({ error: 'scanId is required' })
    return
  }

  const scan = await prisma.scan.findFirst({
    where: { id: scanId, userId: user.id },
    include: { results: true, report: true },
  })

  if (!scan) {
    res.status(404).json({ error: 'Scan not found' })
    return
  }

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595, 842])
  const font = await pdf.embedFont(StandardFonts.Helvetica)

  let y = 800
  const write = (text: string, size = 11) => {
    page.drawText(text, { x: 50, y, size, font, color: rgb(0.1, 0.12, 0.18) })
    y -= size + 8
  }

  write('CyberShield X Threat Report', 18)
  write(`Scan ID: ${scan.id}`)
  write(`Target: ${scan.target}`)
  write(`Type: ${scan.type}`)
  write(`Risk Score: ${scan.riskScore} (${scan.riskLevel})`)
  write(`Generated At: ${new Date().toISOString()}`)
  y -= 6
  write('AI Summary:', 13)
  write((scan.report?.reportBody || 'No summary').slice(0, 1200))
  y -= 6
  write('Mitigation Advice:', 13)
  const mitigation = (scan.report?.mitigationSteps as string[] | null) || []
  mitigation.slice(0, 5).forEach((item, idx) => write(`${idx + 1}. ${item}`))

  const bytes = await pdf.save()
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="cybershield-report-${scan.id}.pdf"`)
  res.status(200).send(Buffer.from(bytes))
})
