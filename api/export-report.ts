import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  PDFDocument,
  StandardFonts,
  degrees,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib'

import { allowMethods, withErrorHandling } from './_lib/http.js'
import { requireAuth } from './_lib/guards.js'
import { prisma } from './_lib/db.js'

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_W = 595
const PAGE_H = 842
const MARGIN = 50
const CONTENT_W = PAGE_W - MARGIN * 2

const HEADER_H = 56
const FOOTER_H = 36

const CONTENT_TOP = PAGE_H - HEADER_H - 16
const CONTENT_BOTTOM = FOOTER_H + 20

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  headerBg: rgb(0.06, 0.07, 0.13),
  footerBg: rgb(0.06, 0.07, 0.13),
  accent: rgb(0.29, 0.56, 1.0),

  white: rgb(1, 1, 1),
  ink: rgb(0.1, 0.12, 0.18),
  muted: rgb(0.45, 0.47, 0.55),
  divider: rgb(0.82, 0.84, 0.90),

  safe: rgb(0.13, 0.69, 0.47),
  low: rgb(0.13, 0.69, 0.47),
  medium: rgb(0.96, 0.62, 0.04),
  high: rgb(0.93, 0.31, 0.19),
  critical: rgb(0.78, 0.10, 0.10),

  stampInk: rgb(0.78, 0.10, 0.10),
  stampFill: rgb(1.0, 0.95, 0.95),
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sanitizeText(value: unknown): string {
  if (value == null) return ''

  return String(value)
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/[•]/g, '-')
    .replace(/[—–]/g, '-')
    .replace(/[©]/g, '(c)')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
}

function stripMarkdown(text: string): string {
  return sanitizeText(
    text
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/^[-*]\s+/gm, '')
      .replace(/`([^`]*)`/g, '$1'),
  )
}

function riskColor(level: string) {
  const l = sanitizeText(level).toLowerCase()

  if (l === 'safe') return C.safe
  if (l === 'low') return C.low
  if (l === 'medium') return C.medium
  if (l === 'high') return C.high
  if (l === 'critical') return C.critical

  return C.ink
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  text = sanitizeText(text)

  const words = text.split(' ')
  const lines: string[] = []

  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word

    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate
    } else {
      if (current) lines.push(current)
      current = word
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

function drawHeader(
  page: PDFPage,
  regular: PDFFont,
  bold: PDFFont,
) {
  page.drawRectangle({
    x: 0,
    y: PAGE_H - HEADER_H,
    width: PAGE_W,
    height: HEADER_H,
    color: C.headerBg,
  })

  page.drawRectangle({
    x: 0,
    y: PAGE_H - HEADER_H,
    width: PAGE_W,
    height: 2,
    color: C.accent,
  })

  page.drawText('CyberShield', {
    x: MARGIN,
    y: PAGE_H - 34,
    size: 18,
    font: bold,
    color: C.white,
  })

  const logoW = bold.widthOfTextAtSize('CyberShield', 18)

  page.drawText(' X', {
    x: MARGIN + logoW,
    y: PAGE_H - 34,
    size: 18,
    font: bold,
    color: C.accent,
  })

  page.drawText('Threat Intelligence Report', {
    x: MARGIN,
    y: PAGE_H - 48,
    size: 8,
    font: regular,
    color: C.muted,
  })

  const label = 'CONFIDENTIAL'

  const lw = regular.widthOfTextAtSize(label, 7.5)

  page.drawText(label, {
    x: PAGE_W - MARGIN - lw,
    y: PAGE_H - 38,
    size: 7.5,
    font: regular,
    color: C.muted,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────

function drawFooter(
  page: PDFPage,
  regular: PDFFont,
  pageNum: number,
  totalPages: number,
  generatedAt: string,
) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: FOOTER_H,
    color: C.footerBg,
  })

  page.drawRectangle({
    x: 0,
    y: FOOTER_H - 1,
    width: PAGE_W,
    height: 1,
    color: C.accent,
  })

  page.drawText(`Generated: ${sanitizeText(generatedAt)}`, {
    x: MARGIN,
    y: 13,
    size: 7.5,
    font: regular,
    color: C.muted,
  })

  const pageLabel = `Page ${pageNum} of ${totalPages}`

  const pw = regular.widthOfTextAtSize(pageLabel, 7.5)

  page.drawText(pageLabel, {
    x: PAGE_W / 2 - pw / 2,
    y: 13,
    size: 7.5,
    font: regular,
    color: C.muted,
  })

  const footerText = '(c) CyberShield X - For authorised use only'

  page.drawText(footerText, {
    x:
      PAGE_W -
      MARGIN -
      regular.widthOfTextAtSize(footerText, 7.5),

    y: 13,
    size: 7.5,
    font: regular,
    color: C.muted,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Certified Badge
// ─────────────────────────────────────────────────────────────────────────────

function drawCertifiedBadge(
  page: PDFPage,
  regular: PDFFont,
  bold: PDFFont,
) {
  const centerX = PAGE_W - MARGIN - 62
  const centerY = FOOTER_H + 62

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: 56,
    color: C.stampFill,
    borderColor: C.stampInk,
    borderWidth: 2,
  })

  page.drawCircle({
    x: centerX,
    y: centerY,
    size: 44,
    borderColor: C.stampInk,
    borderWidth: 1,
  })

  const mark = 'CERTIFIED'

  const markW = bold.widthOfTextAtSize(mark, 14)

  page.drawText(mark, {
    x: centerX - markW / 2,
    y: centerY - 7,
    size: 14,
    font: bold,
    color: C.stampInk,
    rotate: degrees(16),
  })

  const sub = 'CYBERSHIELD VERIFIED'

  const subW = regular.widthOfTextAtSize(sub, 6.5)

  page.drawText(sub, {
    x: centerX - subW / 2,
    y: centerY + 20,
    size: 6.5,
    font: regular,
    color: C.stampInk,
  })

  const ds = sanitizeText(
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  )

  const dsW = regular.widthOfTextAtSize(ds, 6.5)

  page.drawText(ds, {
    x: centerX - dsW / 2,
    y: centerY - 28,
    size: 6.5,
    font: regular,
    color: C.stampInk,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Handler
// ─────────────────────────────────────────────────────────────────────────────

export default withErrorHandling(
  async (req: VercelRequest, res: VercelResponse) => {
    allowMethods(['GET'], req)

    const user = await requireAuth(req)

    const scanId = sanitizeText(req.query.scanId || '')

    if (!scanId) {
      return res.status(400).json({
        error: 'scanId is required',
      })
    }

    const scan = await prisma.scan.findFirst({
      where: {
        id: scanId,
        userId: user.id,
      },
      include: {
        results: true,
        report: true,
      },
    })

    if (!scan) {
      return res.status(404).json({
        error: 'Scan not found',
      })
    }

    const pdf = await PDFDocument.create()

    const regular = await pdf.embedFont(StandardFonts.Helvetica)
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const italic = await pdf.embedFont(StandardFonts.HelveticaOblique)
    const mono = await pdf.embedFont(StandardFonts.Courier)

    const generatedAt = sanitizeText(
      new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    )

    // ─────────────────────────────────────────────────────────────────────────

    const pages: PDFPage[] = []

    let currentPage!: PDFPage
    let y = 0

    function addPage() {
      currentPage = pdf.addPage([PAGE_W, PAGE_H])

      pages.push(currentPage)

      y = CONTENT_TOP
    }

    function ensureSpace(needed: number) {
      if (y - needed < CONTENT_BOTTOM) {
        addPage()
      }
    }

    addPage()

    // ─────────────────────────────────────────────────────────────────────────
    // Drawing Helpers
    // ─────────────────────────────────────────────────────────────────────────

    function text(
      str: string,
      x: number,
      size: number,
      font: PDFFont,
      color = C.ink,
    ) {
      ensureSpace(size + 8)

      currentPage.drawText(sanitizeText(str), {
        x,
        y,
        size,
        font,
        color,
      })

      y -= size + 5
    }

    function wrappedText(
      str: string,
      x: number,
      maxW: number,
      size: number,
      font: PDFFont,
      color = C.ink,
      lineGap = 4,
    ) {
      const lines = wrapText(str, font, size, maxW)

      for (const line of lines) {
        ensureSpace(size + lineGap)

        currentPage.drawText(sanitizeText(line), {
          x,
          y,
          size,
          font,
          color,
        })

        y -= size + lineGap
      }
    }

    function divider() {
      ensureSpace(10)

      currentPage.drawLine({
        start: { x: MARGIN, y },
        end: { x: PAGE_W - MARGIN, y },
        thickness: 0.5,
        color: C.divider,
      })

      y -= 8
    }

    function sectionHeader(title: string) {
      ensureSpace(28)

      y -= 6

      currentPage.drawRectangle({
        x: MARGIN,
        y: y - 2,
        width: CONTENT_W,
        height: 20,
        color: C.headerBg,
      })

      currentPage.drawRectangle({
        x: MARGIN,
        y: y - 2,
        width: CONTENT_W,
        height: 1,
        color: C.accent,
      })

      currentPage.drawText(sanitizeText(title.toUpperCase()), {
        x: MARGIN + 8,
        y: y + 3,
        size: 9,
        font: bold,
        color: C.white,
      })

      y -= 26
    }

    function labelValue(
      label: string,
      value: string,
      labelW = 140,
      valueFont: PDFFont = regular,
      valueColor = C.ink,
    ) {
      ensureSpace(16)

      currentPage.drawText(sanitizeText(label), {
        x: MARGIN,
        y,
        size: 9.5,
        font: bold,
        color: C.muted,
      })

      wrappedText(
        sanitizeText(value),
        MARGIN + labelW,
        CONTENT_W - labelW,
        9.5,
        valueFont,
        valueColor,
      )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Cover
    // ─────────────────────────────────────────────────────────────────────────

    text(
      'THREAT INTELLIGENCE DOSSIER',
      MARGIN,
      10,
      bold,
      C.accent,
    )

    wrappedText(
      `Type: ${sanitizeText(scan.type).toUpperCase()} - Generated for incident response and governance workflows`,
      MARGIN,
      CONTENT_W,
      9,
      italic,
      C.muted,
    )

    y -= 4

    text(sanitizeText(scan.target), MARGIN, 20, bold)

    const rLevel = sanitizeText(scan.riskLevel || 'Unknown')

    const badgeText = ` ${rLevel.toUpperCase()} `

    const bw = bold.widthOfTextAtSize(badgeText, 10) + 4

    currentPage.drawRectangle({
      x: MARGIN,
      y: y - 4,
      width: bw,
      height: 16,
      color: riskColor(rLevel),
    })

    currentPage.drawText(badgeText, {
      x: MARGIN + 2,
      y: y - 1,
      size: 10,
      font: bold,
      color: C.white,
    })

    currentPage.drawText(
      ` Risk Score: ${sanitizeText(scan.riskScore ?? 0)}/100`,
      {
        x: MARGIN + bw + 6,
        y: y - 1,
        size: 10,
        font: regular,
        color: C.ink,
      },
    )

    y -= 22

    divider()

    // ─────────────────────────────────────────────────────────────────────────
    // Scan Details
    // ─────────────────────────────────────────────────────────────────────────

    sectionHeader('Scan Details')

    labelValue('Scan ID', sanitizeText(scan.id), 140, mono)

    labelValue('Target', sanitizeText(scan.target))

    labelValue('Scan Type', sanitizeText(scan.type))

    labelValue('Risk Level', rLevel)

    labelValue(
      'Risk Score',
      sanitizeText(scan.riskScore ?? 0),
    )

    labelValue(
      'Matched Rules',
      sanitizeText(
        (scan.matchedRules as string[] | null)?.join(', ') || 'None',
      ),
    )

    labelValue(
      'Scanned At',
      scan.createdAt
        ? sanitizeText(
            new Date(scan.createdAt).toLocaleString('en-GB'),
          )
        : 'N/A',
    )

    labelValue('Report Generated', generatedAt)

    // ─────────────────────────────────────────────────────────────────────────
    // Signals
    // ─────────────────────────────────────────────────────────────────────────

    const result = scan.results?.[0]

    const rawData =
      (result?.signals as Record<string, unknown>) || null

    if (rawData) {
      sectionHeader('Signals')

      const signals: Record<string, string> = {
        'Breach Count': sanitizeText(rawData.breachCount ?? 0),
        'Blacklist Hits': sanitizeText(rawData.blacklistHits ?? 0),
        'Spam Score': sanitizeText(rawData.spamScore ?? 'N/A'),
      }

      for (const [label, value] of Object.entries(signals)) {
        labelValue(label, value)
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AI Summary
    // ─────────────────────────────────────────────────────────────────────────

    const rawSummary = sanitizeText(
      scan.report?.reportBody || '',
    )

    if (rawSummary) {
      sectionHeader('AI Threat Summary')

      const paragraphs = rawSummary.split(/\.\s+/)

      for (const para of paragraphs) {
        const trimmed = sanitizeText(para)

        if (!trimmed) continue

        wrappedText(
          trimmed,
          MARGIN,
          CONTENT_W,
          9.5,
          regular,
          C.ink,
          5,
        )

        y -= 4
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Mitigation
    // ─────────────────────────────────────────────────────────────────────────

    const mitigation =
      (scan.report?.mitigationSteps as string[] | null) || []

    if (mitigation.length > 0) {
      sectionHeader('Mitigation Steps')

      mitigation.forEach((step, idx) => {
        ensureSpace(18)

        currentPage.drawText(`${idx + 1}.`, {
          x: MARGIN,
          y,
          size: 9.5,
          font: bold,
          color: C.accent,
        })

        wrappedText(
          sanitizeText(stripMarkdown(step)),
          MARGIN + 18,
          CONTENT_W - 18,
          9.5,
          regular,
          C.ink,
          5,
        )

        y -= 4
      })
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Finalize
    // ─────────────────────────────────────────────────────────────────────────

    const totalPages = pages.length

    pages.forEach((page, index) => {
      drawHeader(page, regular, bold)

      drawFooter(
        page,
        regular,
        index + 1,
        totalPages,
        generatedAt,
      )

      if (index === totalPages - 1) {
        drawCertifiedBadge(page, regular, bold)
      }
    })

    const bytes = await pdf.save()

    res.setHeader('Content-Type', 'application/pdf')

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cybershield-report-${sanitizeText(scan.id)}.pdf"`,
    )

    return res.status(200).send(Buffer.from(bytes))
  },
)
