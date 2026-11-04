/**
 * Performance budget for the built site.
 *
 * Run: npm run budget   (after a build — either `npm run build` or the
 *                        static export)
 *
 * Measures what a browser is actually made to download before the page is
 * interactive: every <script src> and every stylesheet in the rendered HTML,
 * deduplicated per route and gzipped the way the wire does it. This is
 * deliberately not Next's own "First Load JS" number — that figure is useful
 * but it is computed from the compiler's graph, and the thing worth guarding
 * is the bytes a cold visitor pays for.
 *
 * The budgets below are a ratchet: they are set just above today's numbers so
 * that a dependency added for one section cannot quietly become a tax on every
 * page. Raising a number is allowed — it just has to be a deliberate edit to
 * this file, in a diff somebody reviews.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join, relative } from 'node:path'

const ROOT = process.cwd()

/** Gzipped kilobytes. */
const BUDGET = {
  /** JavaScript every route must download, before it can hydrate. */
  js: 200,
  /** CSS. */
  css: 32,
  /** The HTML document itself, including inline flight data. */
  html: 130,
  /** JS + CSS + HTML — the first cold request's total weight. */
  total: 330,
}

const kb = (n) => `${(n / 1024).toFixed(1)} kB`

// ---------------------------------------------------------------- locate build
const usingExport = existsSync(join(ROOT, 'out'))
const htmlRoot = usingExport ? join(ROOT, 'out') : join(ROOT, '.next/server/app')
const assetRoot = usingExport ? join(ROOT, 'out') : join(ROOT, '.next')

if (!usingExport && !existsSync(htmlRoot)) {
  console.error('No build found. Run `npm run build` first.')
  process.exit(1)
}

/** Every rendered .html file, keyed by the route a visitor would type. */
function collectHtml(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '_next') continue
      collectHtml(path, out)
    } else if (entry.name.endsWith('.html')) {
      out.push(path)
    }
  }
  return out
}

/**
 * Map a URL path in the HTML to a file on disk.
 *
 * Under static export every asset carries the base path, and in the Next build
 * it does not — so the lookup walks the path's leading segments off until a
 * file matches. Cheaper and more honest than threading the build's env vars in.
 */
function resolveAsset(urlPath) {
  const clean = urlPath.split('?')[0].replace(/^\//, '')
  const parts = clean.split('/')
  for (let i = 0; i < parts.length; i += 1) {
    const candidate = join(assetRoot, ...parts.slice(i))
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

const gzipped = new Map()
function sizeOf(urlPath) {
  if (gzipped.has(urlPath)) return gzipped.get(urlPath)
  const file = resolveAsset(urlPath)
  const size = file ? gzipSync(readFileSync(file), { level: 9 }).length : 0
  gzipped.set(urlPath, size)
  return size
}

// ---------------------------------------------------------------- measure
const rows = []
for (const file of collectHtml(htmlRoot)) {
  const html = readFileSync(file, 'utf8')

  // `noModule` scripts are skipped by every browser that supports ES modules —
  // the polyfill bundle is a tax on browsers nobody is reading this on. Count
  // what modern engines actually fetch.
  const scripts = [...html.matchAll(/<script([^>]*)>/g)]
    .filter((m) => /\bsrc="/.test(m[1]) && !/\bnoModule\b/i.test(m[1]))
    .map((m) => m[0].match(/\bsrc="([^"]+)"/)[1])
  const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g)].map(
    (m) => m[1],
  )

  const js = [...new Set(scripts)].reduce((sum, src) => sum + sizeOf(src), 0)
  const css = [...new Set(styles)].reduce((sum, href) => sum + sizeOf(href), 0)
  const doc = gzipSync(html, { level: 9 }).length

  const route =
    '/' +
    relative(htmlRoot, file)
      .replace(/\\/g, '/')
      .replace(/(index)?\.html$/, '')
      .replace(/\/$/, '')

  rows.push({ route, js, css, html: doc, total: js + css + doc })
}

rows.sort((a, b) => b.total - a.total)

// ---------------------------------------------------------------- report
const worst = {
  js: Math.max(...rows.map((r) => r.js)),
  css: Math.max(...rows.map((r) => r.css)),
  html: Math.max(...rows.map((r) => r.html)),
  total: Math.max(...rows.map((r) => r.total)),
}

const failures = []
for (const key of Object.keys(BUDGET)) {
  if (worst[key] > BUDGET[key] * 1024) {
    const over = rows.filter((r) => r[key] > BUDGET[key] * 1024)
    failures.push(
      `${key}: ${kb(worst[key])} across ${over.length} route(s) — budget ${BUDGET[key]} kB ` +
        `(${over
          .slice(0, 5)
          .map((r) => r.route)
          .join(', ')}${over.length > 5 ? ', …' : ''})`,
    )
  }
}

console.log(`\nPerformance budget — ${rows.length} pages, measured from ${usingExport ? 'out/' : '.next/'}\n`)
console.log(
  ['route'.padEnd(44), 'js'.padStart(9), 'css'.padStart(8), 'html'.padStart(9), 'total'.padStart(9)].join(
    '',
  ),
)
for (const row of rows.slice(0, 8)) {
  console.log(
    [
      row.route.padEnd(44),
      kb(row.js).padStart(9),
      kb(row.css).padStart(8),
      kb(row.html).padStart(9),
      kb(row.total).padStart(9),
    ].join(''),
  )
}
if (rows.length > 8) console.log(`   … ${rows.length - 8} more, all lighter`)

console.log('\nbudget:')
for (const [key, limit] of Object.entries(BUDGET)) {
  const used = (worst[key] / 1024 / limit) * 100
  const bar = used > 100 ? 'OVER' : used > 92 ? 'tight' : 'ok'
  console.log(`  ${key.padEnd(6)} ${kb(worst[key]).padStart(9)} of ${String(limit).padStart(4)} kB  ${used.toFixed(0).padStart(3)}%  ${bar}`)
}

if (failures.length) {
  console.error('\nBudget exceeded:\n' + failures.map((f) => `  ${f}`).join('\n'))
  console.error(
    '\nEither bring the weight down, or raise the number in scripts/check-budget.mjs in the same commit — deliberately, with a reason.\n',
  )
  process.exit(1)
}

console.log('\nWithin budget.\n')
