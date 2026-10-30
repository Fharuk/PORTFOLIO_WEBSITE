'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { scenes } from '@/content/site'

const FlightCanvas = dynamic(
  () => import('./flight-canvas').then((m) => m.FlightCanvas),
  { ssr: false, loading: () => null },
)

/**
 * Scroll is the scrubber. Progress is smoothed toward the real scroll position
 * so the camera inherits a little inertia instead of snapping — the same idea
 * as the scrub engine in scroll-world, which seeks rather than plays.
 */
export function Flight() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const target = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [activeScene, setActiveScene] = useState(0)
  // Mirrored into state because the percentage is rendered, and refs do not
  // trigger renders. Rounded so this re-renders ~100 times, not 60/s.
  const [pct, setPct] = useState(0)
  const [quality, setQuality] = useState<'low' | 'high'>('high')
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const coarse = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    setQuality(coarse.matches ? 'low' : 'high')
    const onMq = () => setReduce(mq.matches)
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  // Only mount the renderer once the section is near the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: '60% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!mounted) return
    let raf = 0
    let running = true

    const read = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const raw = total > 0 ? -rect.top / total : 0
      target.current = Math.min(1, Math.max(0, raw))
    }

    const loop = () => {
      if (!running) return
      // critically-damped-ish smoothing; fast enough to feel direct
      progress.current += (target.current - progress.current) * 0.085

      const idx = Math.min(
        scenes.length - 1,
        Math.floor(((progress.current + 0.02) % 1) * scenes.length),
      )
      setActiveScene((prev) => (prev === idx ? prev : idx))
      const rounded = Math.round(progress.current * 100)
      setPct((prev) => (prev === rounded ? prev : rounded))

      raf = requestAnimationFrame(loop)
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    raf = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [mounted])

  return (
    <section id="flight" aria-labelledby="flight-heading" className="relative">
      {/* The tall runway that scroll scrubs across. */}
      <div ref={sectionRef} className="relative h-[520vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* backdrop the canvas composites over */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 50% 45%, #0a1024 0%, #05070f 62%, var(--color-void) 100%)',
            }}
          />

          {mounted && !reduce && (
            <FlightCanvas progress={progress} quality={quality} />
          )}

          {/* Static poster for reduced motion / no WebGL */}
          {(!mounted || reduce) && (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(38% 40% at 50% 50%, rgba(138,180,255,0.18) 0%, transparent 70%), radial-gradient(20% 24% at 50% 50%, rgba(243,240,231,0.5) 0%, transparent 68%)',
              }}
            />
          )}

          {/* Overlay: captions answer the scroll, they don't decorate it. */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="shell flex h-full flex-col justify-between py-[clamp(5rem,12vh,8rem)]">
              <div className="flex items-start justify-between gap-8">
                <h2
                  id="flight-heading"
                  className="max-w-[18ch] text-[clamp(1.05rem,1.4vw,1.25rem)] font-normal leading-snug text-[var(--color-mist)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  One continuous move through the work. Scrolling does not
                  advance slides — it flies the camera.
                </h2>
                <span className="tabular text-[0.8125rem] text-[var(--color-haze)]">
                  {String(pct).padStart(2, '0')}%
                </span>
              </div>

              <div className="flex items-end justify-between gap-8">
                <div className="min-h-[5.5rem]">
                  <div className="relative">
                    {scenes.map((s, i) => (
                      <div
                        key={s.key}
                        aria-hidden={i !== activeScene}
                        className="absolute bottom-0 left-0 w-full transition-all duration-500 ease-[var(--ease-out-quint)]"
                        style={{
                          opacity: i === activeScene ? 1 : 0,
                          transform:
                            i === activeScene
                              ? 'translateY(0)'
                              : 'translateY(10px)',
                        }}
                      >
                        <p className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none tracking-[-0.03em] text-[var(--color-bone)]">
                          {s.label}
                        </p>
                        <p className="mt-2 max-w-[34ch] text-[0.9375rem] text-[var(--color-haze)]">
                          {s.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress rail: the only ornament, and it is functional. */}
                <div className="hidden w-40 shrink-0 md:block">
                  <div className="relative h-px w-full bg-[color-mix(in_oklab,var(--color-bone)_16%,transparent)]">
                    <span
                      className="absolute inset-y-0 left-0 bg-[var(--color-bone)]"
                      style={{ width: `${pct}%` }}
                    />
                    {scenes.map((s, i) => (
                      <span
                        key={s.key}
                        className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full transition-colors duration-300"
                        style={{
                          left: `${(i / (scenes.length - 1)) * 100}%`,
                          background:
                            i <= activeScene
                              ? 'var(--color-bone)'
                              : 'color-mix(in oklab, var(--color-bone) 22%, transparent)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* top and bottom fades so the canvas melts into the page */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-40 bg-gradient-to-b from-[var(--color-void)] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-[var(--color-void)] to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
