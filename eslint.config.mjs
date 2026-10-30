import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

/**
 * `next lint` was removed in Next 16, and without a config it dropped into an
 * interactive setup prompt, so `npm run lint` could not run unattended.
 *
 * .claude/ holds ~1,100 vendored third-party files that are reference material,
 * not source — linting them would bury real findings in noise.
 */
const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.claude/**',
      'public/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default config
