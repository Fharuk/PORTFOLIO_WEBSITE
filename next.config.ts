import path from 'node:path'
import type { NextConfig } from 'next'

/**
 * @shadergradient/react ships an `exports` map with only an `import` condition.
 * Next resolves the server graph with the `react-server` condition, which the
 * map does not list, so the bare specifier fails to resolve. Aliasing straight
 * at the ESM build sidesteps the exports lookup without patching node_modules.
 */
const shadergradient = path.resolve(
  process.cwd(),
  'node_modules/@shadergradient/react/dist/index.mjs',
)

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shadergradient/react$': shadergradient,
    }
    return config
  },
}

export default nextConfig
