/**
 * Generates public/og.png — the card LinkedIn, WhatsApp and X show when the
 * site is shared.
 *
 * Written as a one-off script rather than an `opengraph-image.tsx` route
 * because the site is also published to GitHub Pages via `output: 'export'`,
 * where dynamic image routes are not available. The output is a committed
 * static file, so both hosts serve the same bytes with no build-time magic.
 *
 * Run: node scripts/make-og.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { createElement as h } from 'react'

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

const el = h(
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
      'Electrical & Electronics Engineering',
    ),
  ),

  // Middle: name + statement.
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 22 } },
    h(
      'div',
      {
        style: {
          fontSize: family === 'Bricolage' ? 84 : 78,
          lineHeight: 1.02,
          letterSpacing: -2.6,
          color: BONE,
        },
      },
      'Akinmade Faruq Adeoye',
    ),
    h(
      'div',
      {
        style: {
          fontSize: 30,
          lineHeight: 1.35,
          color: MIST,
          maxWidth: 900,
        },
      },
      'Power systems. Applied intelligence. Delivery that holds.',
    ),
  ),

  // Bottom: a rule and the lab catalogue.
  h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: `1px solid #ffffff1a`,
        paddingTop: 26,
        
      },
    },
    h('div', { style: { fontSize: 24, color: HAZE } }, 'Lagos, Nigeria'),
    h(
      'div',
      { style: { display: 'flex', gap: 28, fontSize: 24, color: HAZE } },
      h('span', {}, '26 projects'),
      h('span', { style: { color: '#ffffff26' } }, '·'),
      h('span', {}, '3 P6 models'),
      h('span', { style: { color: '#ffffff26' } }, '·'),
      h('span', {}, '5 Zenodo records'),
    ),
  ),
)

const res = new ImageResponse(el, { width: W, height: H, fonts })
const buf = Buffer.from(await res.arrayBuffer())
await mkdir('public', { recursive: true })
await writeFile('public/og.png', buf)
console.log(`wrote public/og.png — ${buf.length} bytes, font: ${family}`)
