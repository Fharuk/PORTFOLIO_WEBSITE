'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  projects,
  categoryLabels,
  projectNote,
  type Category,
  type Project,
} from '@/content/site'
import { cn } from '@/lib/utils'

const FEATURED = [
  'energy-grid-agent',
  'pi-domain-adaptation',
  'automatic-power-stabilizer',
  'power-predictive-maintenance',
  'lagos-route-optimisation',
]

const FILTERS: (Category | 'all')[] = ['all', 'engineering', 'ai', 'software', 'research']

function bySlug(slug: string) {
  return projects.find((p) => p.slug === slug)!
}

function FeaturedCard({ project, large }: { project: Project; large?: boolean }) {
  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-7',
        'border border-[color-mix(in_oklab,var(--color-bone)_12%,transparent)]',
        'transition-colors duration-300',
        large ? 'md:col-span-2 md:min-h-[19rem]' : 'md:min-h-[16rem]',
      )}
      style={{
        background:
          'linear-gradient(160deg, color-mix(in oklab, var(--color-slate) 70%, transparent), color-mix(in oklab, var(--color-abyss) 90%, transparent))',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-[var(--ease-out-quint)] group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(70% 90% at 12% 0%, var(--glow) 0%, transparent 62%)',
        }}
      />

      <div className="relative">
        <p className="text-[0.8125rem] text-[var(--color-haze)]">
          {categoryLabels[project.category]}
        </p>
        <h3
          className={cn(
            'mt-2 leading-[1.08] tracking-[-0.03em] text-[var(--color-bone)]',
            large ? 'text-[clamp(1.5rem,2.6vw,2.15rem)]' : 'text-[clamp(1.2rem,1.9vw,1.5rem)]',
          )}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 350 }}
        >
          {project.title}
        </h3>
        <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
          {project.desc}
        </p>
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">
        <span className="metric text-[0.9375rem]">{project.metric}</span>
        {project.links?.[0] && (
          <a
            href={project.links[0].href}
            className="link text-[0.875rem] text-[var(--color-mist)]"
          >
            {project.links[0].label}
          </a>
        )}
      </div>
    </article>
  )
}

function CatalogueRow({ project }: { project: Project }) {
  return (
    <li className="border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] py-4 last:border-b">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-[1.0625rem] leading-snug text-[var(--color-bone)]">
          {project.title}
        </h3>
        <span className="metric shrink-0 text-[0.8125rem]">{project.metric}</span>
      </div>
      <p className="mt-1.5 max-w-[68ch] text-[0.9rem] leading-relaxed text-[var(--color-haze)]">
        {project.desc}
      </p>
      {project.links?.[0] && (
        <a
          href={project.links[0].href}
          className="link mt-2 inline-block text-[0.8125rem] text-[var(--color-mist)]"
        >
          {project.links[0].label}
        </a>
      )}
    </li>
  )
}

export function Work() {
  const [filter, setFilter] = useState<Category | 'all'>('all')

  const featured = useMemo(() => FEATURED.map(bySlug), [])
  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <section id="work" aria-labelledby="work-heading" className="section">
      <div className="shell">
        <div className="mb-[clamp(2.5rem,5vw,4rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="work-heading" className="h2">
            Selected work
          </h2>
          <p className="text-[0.975rem] leading-relaxed text-[var(--color-haze)] md:justify-self-end md:max-w-[44ch] md:text-right">
            Five that show the range, then all {projects.length}. Each result is
            the metric reported in the project materials — simulation and
            prototype figures, not field performance.
          </p>
        </div>

        {/* Featured — an asymmetric grid, not five identical cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <FeaturedCard project={featured[0]} large />
          <FeaturedCard project={featured[1]} />
          <FeaturedCard project={featured[2]} />
          <FeaturedCard project={featured[3]} />
          <FeaturedCard project={featured[4]} />
        </div>

        {/* Catalogue */}
        <div className="mt-[clamp(3.5rem,7vw,6rem)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="h3">Every project</h3>
            <div
              role="group"
              aria-label="Filter projects by discipline"
              className="flex flex-wrap gap-1.5"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  data-active={filter === f}
                  aria-pressed={filter === f}
                  className="chip"
                >
                  {f === 'all' ? 'All' : categoryLabels[f]}
                  <span className="tabular text-[0.75rem] opacity-60">
                    {f === 'all'
                      ? projects.length
                      : projects.filter((p) => p.category === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={filter}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="grid list-none gap-x-14 p-0 lg:grid-cols-2"
            >
              {filtered.map((p) => (
                <CatalogueRow key={p.slug} project={p} />
              ))}
            </motion.ul>
          </AnimatePresence>

          <p className="mt-8 max-w-[80ch] text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
            <span className="text-[var(--color-haze)]">Note on metrics. </span>
            {projectNote}
          </p>
        </div>
      </div>
    </section>
  )
}
