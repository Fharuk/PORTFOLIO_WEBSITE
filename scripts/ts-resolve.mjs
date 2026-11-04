/**
 * Lets Node run the site's TypeScript content modules directly.
 *
 * content/cv.ts imports '@/content/site', and Node's ESM resolver knows
 * nothing about the tsconfig `paths` alias or extensionless imports. This hook
 * teaches it both, so `scripts/make-cv.mjs` renders the *same* module the page
 * renders instead of keeping a second copy of the CV in JavaScript that could
 * quietly fall out of step with the site.
 */
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = new URL('../', import.meta.url)

const candidates = (base) => [
  base,
  `${base}.ts`,
  `${base}.tsx`,
  `${base}/index.ts`,
]

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const base = fileURLToPath(new URL(specifier.slice(2), root))
    for (const candidate of candidates(base)) {
      if (existsSync(candidate) && /\.(ts|tsx|js|mjs|json)$/.test(candidate)) {
        return nextResolve(pathToFileURL(candidate).href, context)
      }
    }
  }

  if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts')) {
    const base = fileURLToPath(new URL(specifier, context.parentURL))
    for (const candidate of candidates(base)) {
      if (existsSync(candidate) && /\.(ts|tsx|js|mjs|json)$/.test(candidate)) {
        return nextResolve(pathToFileURL(candidate).href, context)
      }
    }
  }

  return nextResolve(specifier, context)
}
