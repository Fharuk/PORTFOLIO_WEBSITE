'use client'

import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'

/**
 * The hero field: an animated 3D gradient plane from @shadergradient/react —
 * the library behind ruucm/shadergradient.
 *
 * Loaded lazily and wrapped in a boundary for two reasons: it pulls a whole R3F
 * renderer that has no business in the initial payload, and if WebGL or the
 * ecosystem versions disagree, the CSS aurora underneath is already painted so
 * the hero is never empty.
 */
const ShaderGradientCanvas = dynamic(
  () => import('@shadergradient/react').then((m) => m.ShaderGradientCanvas),
  { ssr: false, loading: () => null },
)

const ShaderGradient = dynamic(
  () => import('@shadergradient/react').then((m) => m.ShaderGradient),
  { ssr: false, loading: () => null },
)

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.warn('[shader-field] falling back to the CSS aurora', err)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function ShaderField() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  // Three WebGL contexts would otherwise run at once. The hero shader only
  // needs to exist while the hero is on screen; the CSS aurora covers the rest.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setLive(e.isIntersecting),
      { rootMargin: '150px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={hostRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Always-painted base: the shader is an enhancement, not a dependency. */}
      <div className="absolute inset-0 bg-[var(--color-void)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(58% 62% at 18% 22%, rgba(60,84,140,0.40) 0%, transparent 62%)',
            'radial-gradient(48% 54% at 82% 34%, rgba(96,68,112,0.28) 0%, transparent 60%)',
            'radial-gradient(62% 58% at 62% 88%, rgba(120,92,68,0.18) 0%, transparent 64%)',
            'radial-gradient(40% 46% at 30% 78%, rgba(38,92,102,0.20) 0%, transparent 62%)',
          ].join(','),
        }}
      />

      {live && (
      <Boundary>
        <div className="absolute inset-0 opacity-70 mix-blend-screen">
          <ShaderGradientCanvas
            style={{ position: 'absolute', inset: 0 }}
            pixelDensity={1}
            fov={42}
            lazyLoad
          >
            <ShaderGradient
              control="props"
              type="plane"
              animate="on"
              uTime={0}
              uSpeed={0.09}
              uStrength={2.2}
              uDensity={1.35}
              uFrequency={2.6}
              uAmplitude={3.2}
              color1="#06091a"
              color2="#1b2f57"
              color3="#4a3550"
              brightness={0.85}
              grain="on"
              grainBlending={0.28}
              cDistance={3.9}
              cPolarAngle={92}
              cAzimuthAngle={182}
              enableCameraUpdate={false}
            />
          </ShaderGradientCanvas>
        </div>
      </Boundary>
      )}

      {/* Grain + vignette hold the hero together tonally. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(74% 58% at 50% 44%, transparent 30%, rgba(4,6,14,0.5) 70%, var(--color-void) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--color-void))',
        }}
      />
    </div>
  )
}
