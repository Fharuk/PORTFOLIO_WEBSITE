/**
 * Generates public/cv/akinmade-faruq-adeoye-cv.pdf — the CV a recruiter opens.
 *
 * Run: node --experimental-strip-types --loader ./scripts/ts-resolve.mjs scripts/make-cv.mjs
 * (wired up as `npm run cv`)
 *
 * Why a script and not a browser print: this repo has no headless browser in
 * CI, and a PDF produced by "open the page and hit ⌘P" is a file whose
 * typography nobody can review in a diff. This draws the document directly,
 * at A4, from the same content module the /cv page reads — so the page and the
 * PDF cannot disagree, and regenerating after a content edit is one command.
 *
 * Typography: Bricolage Grotesque for the name, Instrument Sans for everything
 * else — the two faces the site is set in, converted to static TTFs in
 * scripts/fonts so both the browser and this script use the same outlines.
 */
import { createWriteStream, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import PDFDocument from 'pdfkit'

import { site } from '../content/site.ts'
import {
  cvCredentialCount,
  cvCredentialGroups,
  cvNote,
  cvProfile,
  cvProjects,
  cvSiteLabel,
  credentialIssuer,
  credentialYear,
} from '../content/cv.ts'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const out = join(root, 'public/cv/akinmade-faruq-adeoye-cv.pdf')
mkdirSync(dirname(out), { recursive: true })

// ---------------------------------------------------------------- tokens
const INK = '#12151c'
const BODY = '#2a2f39'
const MUTED = '#6a7280'
const HAIR = '#dcdfe4'
const ACCENT = '#1f4bc9'

const A4 = { width: 595.28, height: 841.89 }
const M = { top: 42, right: 46, bottom: 46, left: 46 }
const CW = A4.width - M.left - M.right
const BOTTOM = A4.height - M.bottom

const doc = new PDFDocument({
  size: 'A4',
  margins: { ...M, bottom: 0 },
  bufferPages: true,
  info: {
    Title: `${site.fullName} — Curriculum Vitae`,
    Author: site.fullName,
    Subject: `${site.role} · power systems, applied machine learning, project planning`,
    Keywords: 'electrical engineering, machine learning, Primavera P6, project planning, Lagos',
    Creator: 'portfolio /cv',
  },
})

doc.registerFont('Display', join(here, 'fonts/bricolage-500.ttf'))
doc.registerFont('Text', join(here, 'fonts/instrument-sans-400.ttf'))
doc.registerFont('TextBold', join(here, 'fonts/instrument-sans-600.ttf'))

const stream = createWriteStream(out)
doc.pipe(stream)

let y = M.top

// ---------------------------------------------------------------- helpers
const finish = () => {
  // Footers last: the page count is only known once everything is placed.
  const range = doc.bufferedPageRange()
  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(range.start + i)
    const saved = doc.page.margins.bottom
    doc.page.margins.bottom = 0

    doc
      .font('Text')
      .fontSize(7.4)
      .fillColor(MUTED)
      .text(`${site.fullName} · Curriculum Vitae`, M.left, A4.height - 34, {
        width: CW,
        lineBreak: false,
      })
    doc
      .font('Text')
      .fontSize(7.4)
      .fillColor(MUTED)
      .text(`${cvSiteLabel}/cv   ·   ${i + 1} / ${range.count}`, M.left, A4.height - 34, {
        width: CW,
        align: 'right',
        lineBreak: false,
      })

    doc.page.margins.bottom = saved
  }
  doc.end()
}

const newPage = () => {
  doc.addPage()
  y = M.top
  doc
    .font('Text')
    .fontSize(7.4)
    .fillColor(MUTED)
    .text(`${site.fullName} — CV`, M.left, y - 22, { width: CW, lineBreak: false })
  y += 14
}

const ensure = (h) => {
  if (y + h > BOTTOM) newPage()
}

/** Full-width text in the flow. Returns the height used. */
const block = (str, opts = {}) => {
  const {
    font = 'Text',
    size = 8.9,
    color = BODY,
    width = CW,
    x = M.left,
    leading = 1.42,
    charSpace = 0,
    align = 'left',
    gap = 0,
    keepWith = 0,
  } = opts
  doc.font(font).fontSize(size).fillColor(color)
  const h = doc.heightOfString(str, { width, lineGap: size * (leading - 1), characterSpacing: charSpace, align })
  ensure(h + gap + keepWith)
  doc.text(str, x, y, {
    width,
    lineGap: size * (leading - 1),
    characterSpacing: charSpace,
    align,
  })
  y += h + gap
  return h
}

/** Single line pinned at the right edge, without moving the cursor. */
const right = (str, opts = {}) => {
  const { font = 'Text', size = 8.2, color = MUTED } = opts
  doc.font(font).fontSize(size).fillColor(color).text(str, M.left, y, {
    width: CW,
    align: 'right',
    lineBreak: false,
  })
}

const rule = (opts = {}) => {
  const { color = HAIR, weight = 0.6, gapTop = 0, gapBottom = 0, x1 = M.left, x2 = M.left + CW } = opts
  y += gapTop
  doc.moveTo(x1, y).lineTo(x2, y).lineWidth(weight).strokeColor(color).stroke()
  y += gapBottom
}

const sectionHeading = (label, keepWith = 34) => {
  ensure(42 + keepWith)
  y += 13
  doc.font('TextBold').fontSize(7.6).fillColor(MUTED)
  doc.text(label.toUpperCase(), M.left, y, { width: CW, characterSpacing: 1.5, lineBreak: false })
  const h = doc.heightOfString(label.toUpperCase(), { width: CW, characterSpacing: 1.5 })
  rule({ gapTop: h + 3, gapBottom: 9 })
}

// ---------------------------------------------------------------- header
// Availability sits at the top right, where the eye lands after the name.
{
  const label = 'AVAILABLE FOR NEW ROLES'
  doc.font('TextBold').fontSize(6.4)
  const w = doc.widthOfString(label, { characterSpacing: 1.1 }) + 18
  const pillX = M.left + CW - w
  doc.save()
  doc.roundedRect(pillX, y + 4, w, 15, 7.5).fill('#eef1fb')
  doc
    .fillColor(ACCENT)
    .fontSize(6.4)
    .text(label, pillX + 9, y + 8.4, { characterSpacing: 1.1, lineBreak: false })
  doc.restore()
}

block(site.fullName, {
  font: 'Display',
  size: 25,
  color: INK,
  leading: 1.05,
  gap: 3,
  width: CW - 110,
})

block(site.role.toUpperCase(), {
  font: 'TextBold',
  size: 9,
  color: ACCENT,
  charSpace: 1.4,
  gap: 5,
})

block(
  [
    site.location,
    site.contact.email,
    site.contact.phone,
  ].join('   ·   '),
  { size: 8.6, color: BODY, gap: 0 },
)

block(
  [
    site.contact.links.find((l) => l.label === 'LinkedIn')?.href.replace('https://www.', ''),
    site.contact.links.find((l) => l.label === 'GitHub')?.href.replace('https://', ''),
    `${cvSiteLabel}/cv`,
  ].join('   ·   '),
  { size: 8.6, color: MUTED, gap: 0 },
)

y += 2
rule({ color: ACCENT, weight: 1.4, x2: M.left + 54, gapTop: 10, gapBottom: 0 })

// ---------------------------------------------------------------- profile
sectionHeading('Profile')
block(cvProfile, { size: 8.9, color: BODY, leading: 1.5 })

// ---------------------------------------------------------------- planning
sectionHeading('Planning models · Primavera P6')
site.p6.forEach((model, i) => {
  ensure(64)
  if (i > 0) y += 5
  doc.font('TextBold').fontSize(9.4).fillColor(INK)
  const titleH = doc.heightOfString(model.title, { width: CW - 118 })
  doc.text(model.title, M.left, y, { width: CW - 118 })
  right(model.budget, { font: 'TextBold', size: 8.8, color: ACCENT })
  y += titleH + 1.6
  block(
    model.stats.map((s) => `${s.value} ${s.label.toLowerCase()}`).join('  ·  '),
    { size: 7.9, color: MUTED, gap: 1.2 },
  )
  block(model.summary, { size: 8.5, color: BODY, leading: 1.42 })
})

// ---------------------------------------------------------------- research
sectionHeading('Research record')
site.research.forEach((record, i) => {
  ensure(52)
  if (i > 0) y += 5
  doc.font('TextBold').fontSize(8.9).fillColor(INK)
  const titleH = doc.heightOfString(record.title, { width: CW - 74 })
  doc.text(record.title, M.left, y, { width: CW - 74 })
  right(record.href.replace('https://', ''), { size: 7.4 })
  y += titleH + 1.4
  block(`${record.method} — ${record.finding}`, { size: 8.3, color: BODY, leading: 1.38 })
})

// ---------------------------------------------------------------- builds
sectionHeading('Selected builds')
cvProjects.forEach((project, i) => {
  ensure(40)
  if (i > 0) y += 4.5
  doc.font('TextBold').fontSize(8.9).fillColor(INK)
  const titleH = doc.heightOfString(project.title, { width: CW - 108 })
  doc.text(project.title, M.left, y, { width: CW - 108 })
  right(project.metric, { size: 7.9 })
  y += titleH + 1
  block(project.desc, { size: 8.3, color: MUTED, leading: 1.38 })
})

// ---------------------------------------------------------------- experience
sectionHeading('Experience')
site.experience.forEach((role, i) => {
  ensure(58)
  if (i > 0) y += 5
  doc.font('TextBold').fontSize(9.1).fillColor(INK)
  const titleH = doc.heightOfString(role.title, { width: CW - 108 })
  doc.text(role.title, M.left, y, { width: CW - 108 })
  right(role.period, { size: 7.8 })
  y += titleH + 0.8
  block(role.org, { size: 8.3, color: ACCENT, gap: 1 })
  block(role.summary, { size: 8.3, color: BODY, leading: 1.38 })
})

// ---------------------------------------------------------------- education
sectionHeading('Education')
site.education.forEach((entry, i) => {
  ensure(40)
  if (i > 0) y += 4.5
  doc.font('TextBold').fontSize(8.9).fillColor(INK)
  const titleH = doc.heightOfString(entry.degree, { width: CW - 118 })
  doc.text(entry.degree, M.left, y, { width: CW - 118 })
  right(entry.date, { size: 7.8 })
  y += titleH + 0.6
  block(entry.school, { size: 8.3, color: BODY, gap: 0 })
})

// ---------------------------------------------------------------- leadership
sectionHeading('Leadership & service', 48)
site.leadership.forEach((entry, i) => {
  ensure(40)
  if (i > 0) y += 4.5
  doc.font('TextBold').fontSize(8.9).fillColor(INK)
  const titleH = doc.heightOfString(entry.title, { width: CW - 118 })
  doc.text(entry.title, M.left, y, { width: CW - 118 })
  y += titleH + 0.6
  block(`${entry.org} — ${entry.summary}`, { size: 8.3, color: BODY, leading: 1.38 })
})

// ---------------------------------------------------------------- credentials
sectionHeading(`Certifications · ${cvCredentialCount} records`)
cvCredentialGroups.forEach((group, i) => {
  ensure(56)
  if (i > 0) y += 4
  block(group.group.toUpperCase(), {
    font: 'TextBold',
    size: 7.4,
    color: MUTED,
    charSpace: 0.9,
    gap: 1.4,
  })
  const line = group.credentials
    .map((c) => {
      const year = credentialYear(c)
      const issuer = credentialIssuer(c)
      return `${c.title}${issuer ? `, ${issuer}` : ''}${year ? ` (${year})` : ''}`
    })
    .join('   ·   ')
  block(line, { size: 7.6, color: BODY, leading: 1.45 })
})

// ---------------------------------------------------------------- note
y += 8
rule({ gapTop: 6, gapBottom: 7 })
block(cvNote, { size: 7.4, color: MUTED, leading: 1.42, gap: 3 })
block(
  `Full record, ${cvCredentialGroups.reduce((n, g) => n + g.verified, 0)} public verification links, and a case study for every project: ${cvSiteLabel}`,
  { size: 7.6, color: INK, font: 'TextBold', leading: 1.4 },
)

// ---------------------------------------------------------------- closing
// The page's own principle, set in the display face, as the last thing read.
// It is the site's line — not a quotation borrowed for decoration.
y += 16
rule({ gapTop: 4, gapBottom: 12 })
block(site.principle, {
  font: 'Display',
  size: 13.5,
  color: INK,
  leading: 1.24,
  width: CW - 40,
})

finish()

await new Promise((resolve, reject) => {
  stream.on('finish', resolve)
  stream.on('error', reject)
})

console.log(`wrote ${out} (${doc.bufferedPageRange().count} pages)`)
