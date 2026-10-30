import type { NextConfig } from 'next'

/**
 * Static export is opt-in, so one config serves both targets.
 *
 * Vercel gets the default server output (image optimisation, headers, the
 * whole Next runtime). GitHub Pages can only serve files, so it needs
 * `output: 'export'`, and a project site lives under `/<repo>/`, which means a
 * base path as well.
 *
 *   npm run build                                  → Vercel
 *   STATIC_EXPORT=1 STATIC_BASE_PATH=/<repo> npm run build  → Pages
 *
 * `unoptimized` is not optional under export: there is no image optimiser to
 * call, so next/image must render a plain <img>.
 */
const isExport = process.env.STATIC_EXPORT === '1'
const basePath = process.env.STATIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'], unoptimized: isExport },
  ...(isExport ? { output: 'export' as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Inlined at build time so client components can prefix /public assets.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}

export default nextConfig
