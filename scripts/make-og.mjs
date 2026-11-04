/**
 * Generates the share cards: public/og.png for the site, and
 * public/og/<slug>.png for every case study.
 *
 * Written as a script rather than an `opengraph-image.tsx` route because the
 * site is also published to GitHub Pages via `output: 'export'`, where dynamic
 * image routes are not available. The output is committed static files, so both
 * hosts serve the same bytes with no build-time magic — and the social crawlers
 * that matter (LinkedIn, WhatsApp, X) fetch a plain PNG rather than waiting on a
 * function to render one.
 *
 * The card reads from the same content modules the pages do, so a retitled
 * project produces a retitled card. Re-run after editing content/case-studies.ts:
 *
 *   npm run og
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { createElement as h } from 'react'
import { caseStudySlugs, getCaseStudy } from '../content/case-studies.ts'

const W = 1200
const H = 630

const BONE = '#f3f0e7'
const MIST = '#a9b0c4'
const HAZE = '#6f7891'
const ACCENT = '#6ea8ff'
const ACCENT_2 = '#58d6e6'

const fonts = []
let family = 'Noto Sans'

// Prefer the site's own display face. satori rejects woff2 ("Unsupported
// OpenType signature wOF2"), so scripts/fonts holds a TTF converted from the
// Fontsource woff2 with fonttools:
//   python3 -c "from fontTools.ttLib import TTFont; f=TTFont(SRC); f.flavor=None; f.save(DST)"
// If that file is missing, fall back to the TTF inside next/og so the script
// can never hard-fail.
try {
  const ttf = await readFile('scripts/fonts/bricolage-grotesque.ttf')
  fonts.push({ name: 'Bricolage', data: ttf, weight: 400, style: 'normal' })
  family = 'Bricolage'
} catch (err) {
  console.warn('Bricolage TTF unavailable, falling back to Noto Sans:', err.message)
}

if (family === 'Noto Sans') {
  fonts.push({
    name: 'Noto Sans',
    data: await readFile('node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf'),
    weight: 400,
    style: 'normal',
  })
}

// next/og is CommonJS with no "exports" entry for ESM, so a bare `import`
// resolves to an extensionless path and throws ERR_MODULE_NOT_FOUND.
const require = createRequire(import.meta.url)
const { ImageResponse } = require('next/og')

/** The shell every card shares: glow, hairline grid, mark, eyebrow, footer. */
function card({
  eyebrow,
  title,
  titleSize = 84,
  statement,
  statementSize = 30,
  footerLeft,
  footerRight,
  footerSize = 24,
}) {
  return h(
    'div',
    {
      style: {
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#04060e',
        position: 'relative',
        padding: '72px 80px',
        fontFamily: family,
      },
    },
    // Accent glow, echoing the flux hero.
    h('div', {
      style: {
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(900px 520px at 12% -10%, ${ACCENT}33 0%, transparent 60%), radial-gradient(760px 460px at 96% 108%, ${ACCENT_2}26 0%, transparent 62%)`,
      },
    }),
    // Hairline grid, very low contrast.
    h('div', {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(to right, #ffffff08 1px, transparent 1px)`,
        backgroundSize: '80px 100%',
      },
    }),

    // Top row: mark + discipline.
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      h('div', {
        style: {
          width: 14,
          height: 14,
          borderRadius: 999,
          background: `linear-gradient(140deg, ${BONE}, ${ACCENT}, ${ACCENT_2})`,
        },
      }),
      h(
        'div',
        {
          style: {
            fontSize: 22,
            letterSpacing: 3.5,
            textTransform: 'uppercase',
            color: HAZE,
          },
        },
        eyebrow,
      ),
    ),

    // Middle: name (or project title) + the line under it.
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 22 } },
      h(
        'div',
        {
          style: {
            fontSize: family === 'Bricolage' ? titleSize : titleSize - 6,
            lineHeight: 1.02,
            letterSpacing: titleSize > 70 ? -2.6 : -1.4,
            color: BONE,
          },
        },
        title,
      ),
      h(
        'div',
        {
          style: {
            fontSize: statementSize,
            lineHeight: 1.35,
            color: MIST,
            maxWidth: 900,
          },
        },
        statement,
      ),
    ),

    // Bottom: a rule and whatever the card is accountable to.
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          borderTop: `1px solid #ffffff1a`,
          paddingTop: 26,
        },
      },
      h('div', { style: { fontSize: footerSize, color: HAZE } }, footerLeft),
      h('div', { style: { fontSize: footerSize, color: HAZE } }, footerRight),
    ),
  )
}

async function write(target, element) {
  const res = new ImageResponse(element, { width: W, height: H, fonts })
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(target, buf)
  return buf.length
}

// ---- The site card -------------------------------------------------------
const siteCard = card({
  eyebrow: 'Electrical & Electronics Engineering',
  title: 'Akinmade Faruq Adeoye',
  titleSize: 84,
  statement: 'Power systems. Applied intelligence. Delivery that holds.',
  footerLeft: 'Lagos, Nigeria',
  footerRight: '29 projects · 3 P6 models · 5 Zenodo records',
})

await mkdir('public', { recursive: true })
const siteBytes = await write('public/og.png', siteCard)
console.log(`wrote public/og.png — ${siteBytes} bytes, font: ${family}`)

// ---- One card per case study --------------------------------------------
await mkdir('public/og', { recursive: true })

/**
 * Titles run from "Naija Legal Aid" to a 58-character pipeline scope, so the
 * size steps down rather than letting a long title run to four lines and
 * collide with the rule.
 */
const sizeFor = (text) => {
  if (text.length <= 26) return 82
  if (text.length <= 46) return 68
  if (text.length <= 68) return 56
  return 50
}

let total = 0
for (const slug of caseStudySlugs) {
  const study = getCaseStudy(slug)
  if (!study) continue

  // Research records answer to a DOI; everything else answers to its metric.
  const footerRight = study.published
    ? `DOI ${study.published.doi}`
    : study.kind === 'planning-model'
      ? 'Primavera P6 · planning model'
      : 'Case study'

  const bytes = await write(
    `public/og/${study.slug}.png`,
    card({
      eyebrow: study.published ? 'Research record' : study.eyebrow,
      title: study.title,
      titleSize: sizeFor(study.title),
      statement: study.metric,
      statementSize: 32,
      footerLeft: 'Akinmade Faruq Adeoye · faruk-portfolio-eight.vercel.app',
      footerRight,
      footerSize: 20,
    }),
  )
  total += bytes
}

console.log(
  `wrote ${caseStudySlugs.length} case-study cards to public/og/ — ${(total / 1024).toFixed(0)} kB total`,
)
