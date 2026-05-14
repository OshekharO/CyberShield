import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { allowMethods, withErrorHandling } from '../lib/api/http.js'
import { requireAuth } from '../lib/api/guards.js'
import { prisma } from '../lib/api/db.js'

// ─── Layout constants ────────────────────────────────────────────────────────
const PAGE_W = 595
const PAGE_H = 842
const MARGIN = 50
const CONTENT_W = PAGE_W - MARGIN * 2
const HEADER_H = 56      // height of the top header bar
const FOOTER_H = 36      // height of the bottom footer bar
const CONTENT_TOP = PAGE_H - HEADER_H - 16   // first usable y after header
const CONTENT_BOTTOM = FOOTER_H + 20         // last usable y before footer

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  headerBg:   rgb(0.06, 0.07, 0.13),
  footerBg:   rgb(0.06, 0.07, 0.13),
  accent:     rgb(0.29, 0.56, 1.0),
  white:      rgb(1, 1, 1),
  ink:        rgb(0.1, 0.12, 0.18),
  muted:      rgb(0.45, 0.47, 0.55),
  divider:    rgb(0.82, 0.84, 0.90),
  safe:       rgb(0.13, 0.69, 0.47),
  low:        rgb(0.13, 0.69, 0.47),
  medium:     rgb(0.96, 0.62, 0.04),
  high:       rgb(0.93, 0.31, 0.19),
  critical:   rgb(0.78, 0.10, 0.10),
  badgeBg:    rgb(0.94, 0.96, 1.0),
  badgeBorder: rgb(0.29, 0.56, 1.0),
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s*/g, '')      // headings
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')  // bold / italic
    .replace(/^[-*]\s+/gm, '')      // unordered list bullets
    .replace(/`([^`]*)`/g, '$1')    // inline code
    .trim()
}

function riskColor(level: string) {
  const l = (level || '').toLowerCase()
  if (l === 'safe')     return C.safe
  if (l === 'low')      return C.low
  if (l === 'medium')   return C.medium
  if (l === 'high')     return C.high
  if (l === 'critical') return C.critical
  return C.ink
}

/** Wrap a string into lines of at most maxWidth points, breaking on spaces.
 *  Words wider than maxWidth are kept on their own line (pdf-lib will clip them). */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate
    } else {
      if (current) lines.push(current)
      // If the word alone still exceeds maxWidth, push it as-is (will clip at page edge)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Draw the branded header bar on a page. */
function drawHeader(page: PDFPage, regular: PDFFont, bold: PDFFont) {
  page.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C.headerBg })
  // Logo text
  page.drawText('CyberShield', { x: MARGIN, y: PAGE_H - 34, size: 18, font: bold, color: C.white })
  const logoW = bold.widthOfTextAtSize('CyberShield', 18)
  page.drawText(' X', { x: MARGIN + logoW, y: PAGE_H - 34, size: 18, font: bold, color: C.accent })
  // Tagline
  page.drawText('Threat Intelligence Report', {
    x: MARGIN, y: PAGE_H - 48, size: 8, font: regular, color: C.muted,
  })
  // Right-side label
  const label = 'CONFIDENTIAL'
  const lw = regular.widthOfTextAtSize(label, 7.5)
  page.drawText(label, { x: PAGE_W - MARGIN - lw, y: PAGE_H - 38, size: 7.5, font: regular, color: C.muted })
}

/** Draw the footer bar on a page. */
function drawFooter(page: PDFPage, regular: PDFFont, pageNum: number, totalPages: number, generatedAt: string) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: FOOTER_H, color: C.footerBg })
  page.drawText(`Generated: ${generatedAt}`, { x: MARGIN, y: 13, size: 7.5, font: regular, color: C.muted })
  const pageLabel = `Page ${pageNum} of ${totalPages}`
  const pw = regular.widthOfTextAtSize(pageLabel, 7.5)
  page.drawText(pageLabel, { x: PAGE_W / 2 - pw / 2, y: 13, size: 7.5, font: regular, color: C.muted })
  page.drawText('© CyberShield X — For authorised use only', {
    x: PAGE_W - MARGIN - regular.widthOfTextAtSize('© CyberShield X — For authorised use only', 7.5),
    y: 13, size: 7.5, font: regular, color: C.muted,
  })
}

/** Draw the certified badge at bottom-right of the last page. */
function drawCertifiedBadge(page: PDFPage, regular: PDFFont, bold: PDFFont) {
  const bw = 130, bh = 52, bx = PAGE_W - MARGIN - bw, by = FOOTER_H + 8
  // outer border
  page.drawRectangle({ x: bx - 1, y: by - 1, width: bw + 2, height: bh + 2, color: C.badgeBorder })
  // background
  page.drawRectangle({ x: bx, y: by, width: bw, height: bh, color: C.badgeBg })
  // shield icon row of stars (decorative)
  const stars = '★ ★ ★ ★ ★'
  const sw = regular.widthOfTextAtSize(stars, 8)
  page.drawText(stars, { x: bx + bw / 2 - sw / 2, y: by + bh - 14, size: 8, font: regular, color: C.accent })
  // Badge title
  const title = 'VERIFIED REPORT'
  const tw = bold.widthOfTextAtSize(title, 8.5)
  page.drawText(title, { x: bx + bw / 2 - tw / 2, y: by + bh - 26, size: 8.5, font: bold, color: C.headerBg })
  // Sub-line
  const sub = 'CyberShield X Certified'
  const subw = regular.widthOfTextAtSize(sub, 7)
  page.drawText(sub, { x: bx + bw / 2 - subw / 2, y: by + bh - 38, size: 7, font: regular, color: C.muted })
  // Date stamp
  const ds = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const dw = regular.widthOfTextAtSize(ds, 7)
  page.drawText(ds, { x: bx + bw / 2 - dw / 2, y: by + 6, size: 7, font: regular, color: C.muted })
}

// ─── Main handler ─────────────────────────────────────────────────────────────

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
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold    = await pdf.embedFont(StandardFonts.HelveticaBold)

  const generatedAt = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })

  // ── Page management ────────────────────────────────────────────────────────
  const pages: PDFPage[] = []
  let currentPage!: PDFPage
  let y = 0

  function addPage() {
    currentPage = pdf.addPage([PAGE_W, PAGE_H])
    pages.push(currentPage)
    y = CONTENT_TOP
  }

  function ensureSpace(needed: number) {
    if (y - needed < CONTENT_BOTTOM) addPage()
  }

  addPage()

  // ── Drawing helpers bound to the current page ──────────────────────────────

  function text(str: string, x: number, size: number, f: PDFFont, color = C.ink) {
    currentPage.drawText(str, { x, y, size, font: f, color })
    y -= size + 5
  }

  function wrappedText(str: string, x: number, maxW: number, size: number, f: PDFFont, color = C.ink, lineGap = 4) {
    const lines = wrapText(str, f, size, maxW)
    for (const line of lines) {
      ensureSpace(size + lineGap)
      currentPage.drawText(line, { x, y, size, font: f, color })
      y -= size + lineGap
    }
  }

  function sectionHeader(title: string) {
    ensureSpace(28)
    y -= 6
    currentPage.drawRectangle({ x: MARGIN, y: y - 2, width: CONTENT_W, height: 20, color: C.headerBg })
    currentPage.drawText(title.toUpperCase(), { x: MARGIN + 8, y: y + 3, size: 9, font: bold, color: C.white })
    y -= 20 + 6
  }

  function divider() {
    ensureSpace(10)
    currentPage.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: C.divider })
    y -= 8
  }

  function labelValue(label: string, value: string, labelW = 140) {
    ensureSpace(16)
    currentPage.drawText(label, { x: MARGIN, y, size: 9.5, font: bold, color: C.muted })
    wrappedText(value, MARGIN + labelW, CONTENT_W - labelW, 9.5, regular, C.ink)
  }

  // ── Cover / overview block ─────────────────────────────────────────────────
  y -= 4

  // Large scan target
  text(scan.target, MARGIN, 20, bold, C.ink)
  y -= 2

  // Risk badge
  const rLevel = scan.riskLevel || 'Unknown'
  const badgeText = ` ${rLevel.toUpperCase()} `
  const bw = bold.widthOfTextAtSize(badgeText, 10) + 4
  currentPage.drawRectangle({ x: MARGIN, y: y - 4, width: bw, height: 16, color: riskColor(rLevel) })
  currentPage.drawText(badgeText, { x: MARGIN + 2, y: y - 1, size: 10, font: bold, color: C.white })
  const riskScoreLabel = `  Risk Score: ${scan.riskScore ?? 0}/100`
  currentPage.drawText(riskScoreLabel, { x: MARGIN + bw + 6, y: y - 1, size: 10, font: regular, color: C.ink })
  y -= 22

  divider()

  // ── Scan Metadata ──────────────────────────────────────────────────────────
  sectionHeader('Scan Details')
  labelValue('Scan ID',      scan.id)
  labelValue('Target',       scan.target)
  labelValue('Scan Type',    scan.type)
  labelValue('Risk Level',   rLevel)
  labelValue('Risk Score',   String(scan.riskScore ?? 0))
  labelValue('Matched Rules', (scan.matchedRules as string[] | null)?.join(', ') || 'None')
  labelValue('Scanned At',   scan.createdAt ? new Date(scan.createdAt).toLocaleString('en-GB') : 'N/A')
  labelValue('Report Generated', generatedAt)

  // ── Signals ───────────────────────────────────────────────────────────────
  const result = scan.results?.[0]
  const signalData = result?.signals as Record<string, unknown> | null | undefined
  const providerData = result?.providers as Record<string, unknown> | null | undefined
  const fidro = providerData?.fidro as Record<string, unknown> | null | undefined
  const usercheck = providerData?.usercheck as Record<string, unknown> | null | undefined
  const emailrep = providerData?.emailrep as Record<string, unknown> | null | undefined
  if (signalData) {
    sectionHeader('Signals')
    const signalFields: Record<string, string> = {
      'Breach Count': String((signalData.breach_count as number | undefined) ?? (signalData.breachCount as number | undefined) ?? (emailrep?.references as number | undefined) ?? 0),
      'Blacklist Hits': String((signalData.blacklist_hits as number | undefined) ?? (signalData.blacklistHits as number | undefined) ?? 0),
      'Spam Score': String((signalData.spam_score as number | undefined) ?? (signalData.spamScore as number | undefined) ?? 'N/A'),
    }
    for (const [lbl, val] of Object.entries(signalFields)) {
      labelValue(lbl, val)
    }
  }

  // ── Provider Details ──────────────────────────────────────────────────────
  if (providerData || fidro || usercheck || emailrep) {
    sectionHeader('Provider Details')
    const providerFields: Array<[string, unknown]> = [
      ['Status', providerData?.statusCode ?? providerData?.status],
      ['Normalized', providerData?.normalizedEmail ?? providerData?.normalizedTarget],
      ['Domain', providerData?.domain],
      ['Domain Age', providerData?.domainAge != null ? `${providerData.domainAge} days` : undefined],
      ['Disposable', fidro?.disposable_email != null ? (fidro.disposable_email ? 'Yes' : 'No') : undefined],
      ['Public Domain', fidro?.public_domain != null ? (fidro.public_domain ? 'Yes' : 'No') : undefined],
      ['Role Account', fidro?.role_account != null ? (fidro.role_account ? 'Yes' : 'No') : undefined],
      ['Spam', usercheck?.spam != null ? (usercheck.spam ? 'Yes' : 'No') : undefined],
      ['MX Providers', Array.isArray(fidro?.mx_providers) ? (fidro.mx_providers as string[]).join(', ') : undefined],
      ['Confidence', usercheck?.confidence != null ? `${usercheck.confidence}%` : undefined],
      ['Provider', providerData?.provider as string | undefined],
    ]
    for (const [lbl, val] of providerFields) {
      if (val !== undefined && val !== null && val !== '') {
        labelValue(lbl, String(val))
      }
    }
  }

  // ── AI Summary ────────────────────────────────────────────────────────────
  const rawSummary = scan.report?.reportBody || ''
  if (rawSummary) {
    sectionHeader('AI Threat Summary')
    const cleaned = stripMarkdown(rawSummary)
    // Split into paragraphs so spacing is natural
    for (const para of cleaned.split(/\n{2,}/)) {
      const trimmed = para.trim()
      if (!trimmed) continue
      ensureSpace(18)
      wrappedText(trimmed, MARGIN, CONTENT_W, 9.5, regular, C.ink, 5)
      y -= 4
    }
  }

  // ── Mitigation Steps ──────────────────────────────────────────────────────
  const mitigation = (scan.report?.mitigationSteps as string[] | null) || []
  if (mitigation.length > 0) {
    sectionHeader('Mitigation Steps')
    mitigation.forEach((step, idx) => {
      ensureSpace(18)
      const num = `${idx + 1}.`
      currentPage.drawText(num, { x: MARGIN, y, size: 9.5, font: bold, color: C.accent })
      wrappedText(stripMarkdown(step), MARGIN + 18, CONTENT_W - 18, 9.5, regular, C.ink, 5)
      y -= 4
    })
  }

  // ── Add header + footer to every page, badge on last ─────────────────────
  const totalPages = pages.length
  pages.forEach((pg, i) => {
    drawHeader(pg, regular, bold)
    drawFooter(pg, regular, i + 1, totalPages, generatedAt)
    if (i === totalPages - 1) {
      drawCertifiedBadge(pg, regular, bold)
    }
  })

  const bytes = await pdf.save()
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="cybershield-report-${scan.id}.pdf"`)
  res.status(200).send(Buffer.from(bytes))
})
