'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '@/content/site'
import { cn } from '@/lib/utils'

const links = [
  { href: '#flight', label: 'Flight' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

/**
 * A displacement map for edge refraction. Chromium will run this inside
 * `backdrop-filter`, which bends the *real* page content behind the glass.
 * Browsers that refuse fall back to the blur + specular stack in globals.css.
 */
function RefractionFilter() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
      <defs>
        <filter id="lg-refract" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.016"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Observe sections so the nav reflects where you actually are.
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => Boolean(e))
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive('#' + visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  // Escape closes the sheet; body scroll locks while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <RefractionFilter />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[padding] duration-300 ease-[var(--ease-out-quint)]',
          scrolled ? 'pt-3' : 'pt-5',
        )}
      >
        <div className="shell">
          <div className="flex items-center justify-between gap-4">
            {/* mark */}
            <a
              href="#top"
              className="group flex items-center gap-2.5"
              aria-label={`${site.name} — home`}
            >
              <span
                aria-hidden="true"
                className="relative grid size-7 place-items-center rounded-full"
                style={{
                  background:
                    'conic-gradient(from 200deg, #f3f0e7, #9fb4d8, #2b3550, #e7c9a4, #f3f0e7)',
                  boxShadow: 'inset 0 0 0 1px rgba(243,240,231,.35)',
                }}
              >
                <span className="size-2.5 rounded-full bg-[var(--color-void)]" />
              </span>
              <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-medium tracking-[-0.02em] text-[var(--color-bone)]">
                {site.name}
              </span>
            </a>

            {/* desktop links */}
            <nav
              aria-label="Sections"
              className="glass glass--refract hidden rounded-full px-1.5 py-1.5 md:block"
            >
              <ul className="flex items-center">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={active === l.href ? 'true' : undefined}
                      className={cn(
                        'relative block rounded-full px-3.5 py-1.5 text-[0.875rem] transition-colors duration-200',
                        active === l.href
                          ? 'text-[var(--color-void)]'
                          : 'text-[var(--color-mist)] hover:text-[var(--color-bone)]',
                      )}
                    >
                      {active === l.href && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-[var(--color-bone)]"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {site.available && (
                <span className="hidden items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--color-shale)_70%,transparent)] px-3 py-1.5 text-[0.8125rem] text-[var(--color-haze)] sm:flex">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7de2a8] opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-[#7de2a8]" />
                  </span>
                  Open to work
                </span>
              )}

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-sheet"
                className="glass flex size-10 items-center justify-center rounded-full md:hidden"
              >
                <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                <span className="relative block h-3 w-4" aria-hidden="true">
                  <span
                    className="absolute left-0 block h-px w-full bg-[var(--color-bone)] transition-transform duration-300 ease-[var(--ease-out-quint)]"
                    style={{
                      top: 2,
                      transform: open ? 'translateY(5px) rotate(45deg)' : 'none',
                    }}
                  />
                  <span
                    className="absolute left-0 block h-px w-full bg-[var(--color-bone)] transition-transform duration-300 ease-[var(--ease-out-quint)]"
                    style={{
                      bottom: 2,
                      transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* mobile sheet — springs, so it can be reversed mid-flight */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-sheet"
            key="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-void)_72%,transparent)] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              aria-label="Sections"
              initial={{ y: '-8%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-6%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="glass liquid-glass absolute inset-x-4 top-20 rounded-3xl p-3"
            >
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3.5 text-[1.35rem] text-[var(--color-bone)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--color-bone)_8%,transparent)]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
