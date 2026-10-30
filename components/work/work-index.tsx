'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site, type Project } from '@/content/site'

function rgbToCss([r, g, b]: [number, number, number], a = 1) {
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
}

function Row({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `project-${project.slug}`

  return (
    <li
      className="group relative border-t border-[color-mix(in_oklab,var(--color-shale)_65%,transparent)] last:border-b"
      onMouseEnter={() => {}}
    >
      {/* the project's own colour, at 4% — a tint, not a card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-[var(--ease-out-quint)] group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, ${rgbToCss(project.rgb, 0.06)}, transparent 55%)`,
        }}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="relative flex w-full items-baseline gap-4 py-[clamp(1.35rem,2.6vw,2.1rem)] text-left transition-transform duration-[350ms] ease-[var(--ease-out-quint)] md:gap-8 md:group-hover:translate-x-1.5"
      >
        <span
          aria-hidden="true"
          className="tabular mt-1 shrink-0 text-[0.8125rem] text-[var(--color-haze)] transition-colors duration-300 group-hover:text-[var(--color-bone)]"
        >
          {project.year}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="block text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.05] tracking-[-0.03em] transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 340,
              color: 'var(--color-bone)',
            }}
          >
            {project.title}
          </span>
          <span className="mt-1.5 block max-w-[54ch] text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
            {project.summary}
          </span>
        </span>

        <span className="mt-1 hidden shrink-0 items-center gap-2 md:flex">
          <span className="text-[0.875rem] text-[var(--color-haze)]">
            {project.role}
          </span>
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-full border border-[color-mix(in_oklab,var(--color-bone)_16%,transparent)] transition-[transform,background,border-color] duration-300 ease-[var(--ease-out-quint)] group-hover:border-[color-mix(in_oklab,var(--color-bone)_40%,transparent)]"
            style={{ transform: open ? 'rotate(45deg)' : 'none' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14 md:pl-[6.5rem]">
              <p className="prose text-[0.975rem]">{project.detail}</p>
              <div className="flex flex-col gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-[color-mix(in_oklab,var(--color-bone)_14%,transparent)] px-2.5 py-1 text-[0.8125rem] text-[var(--color-mist)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <a
                  href={project.href ?? '#contact'}
                  className="link w-fit text-[0.9375rem] text-[var(--color-bone)]"
                >
                  {project.href ? 'Open case study' : 'Ask about this one'}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export function WorkIndex() {
  return (
    <section id="work" aria-labelledby="work-heading" className="section">
      <div className="shell">
        <div className="mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="work-heading" className="h2">
            Selected work
          </h2>
          <p className="prose text-[0.975rem] md:justify-self-end md:text-right">
            Four projects where the render was the point. Open a row for the
            engineering decision behind it.
          </p>
        </div>

        <ol className="list-none p-0">
          {site.projects.map((p, i) => (
            <Row key={p.slug} project={p} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
