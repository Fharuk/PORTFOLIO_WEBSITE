import { site } from '@/content/site'

/**
 * Primavera P6 delivery.
 *
 * These are planning models, and the page says so. The numbers that make them
 * legible are activities, relationships, assignments and risk records — so
 * those get the typographic weight, not a vague description.
 */
export function Planning() {
  return (
    <section id="planning" aria-labelledby="planning-heading" className="section">
      <div className="shell">
        <div className="mb-[clamp(2.5rem,5vw,4rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <div>
            <h2 id="planning-heading" className="h2">
              Project delivery
            </h2>
            <p className="mt-4 max-w-[40ch] text-[0.975rem] leading-relaxed text-[var(--color-haze)]">
              Primavera P6 planning models spanning offshore wind and pipeline
              work — WBS, logic, milestones, resources, cost structures and risk
              registers.
            </p>
          </div>
          <p className="text-[0.8125rem] leading-relaxed text-[var(--color-haze)] md:max-w-[42ch] md:justify-self-end md:text-right">
            {site.p6Note}
          </p>
        </div>

        <div className="flex flex-col">
          {site.p6.map((m) => (
            <article
              key={m.title}
              className="group grid gap-6 border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] py-[clamp(1.75rem,3.5vw,2.75rem)] last:border-b md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12"
            >
              <div>
                <p className="text-[0.8125rem] text-[var(--color-haze)]">{m.group}</p>
                <h3
                  className="mt-2 max-w-[24ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.12] tracking-[-0.03em] text-[var(--color-bone)]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 350 }}
                >
                  {m.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
                  {m.summary}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-5">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                  {m.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="tabular text-[1.15rem] leading-none text-[var(--color-bone)]">
                        {s.value}
                      </dt>
                      <dd className="m-0 mt-1.5 text-[0.75rem] leading-snug text-[var(--color-haze)]">
                        {s.label}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex items-baseline justify-between gap-4 border-t border-[color-mix(in_oklab,var(--color-shale)_45%,transparent)] pt-3">
                  <span className="text-[0.8125rem] text-[var(--color-haze)]">
                    Modelled budget
                  </span>
                  <span
                    className="metric text-[clamp(1.1rem,1.6vw,1.4rem)]"
                    aria-label={`Modelled budget ${m.budget}`}
                  >
                    {m.budget}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="section pt-0">
      <div className="shell">
        <div className="mb-[clamp(2rem,4vw,3rem)] grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="research-heading" className="h2">
            Research records
          </h2>
          <p className="text-[0.8125rem] leading-relaxed text-[var(--color-haze)] md:max-w-[42ch] md:justify-self-end md:text-right">
            {site.researchNote}
          </p>
        </div>

        <ol className="list-none p-0">
          {site.research.map((r) => (
            <li
              key={r.title}
              className="grid gap-2 border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] py-[clamp(1.25rem,2.4vw,1.75rem)] last:border-b md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-baseline md:gap-10"
            >
              <h3 className="max-w-[34ch] text-[1.0625rem] leading-snug text-[var(--color-bone)]">
                {r.title}
              </h3>
              <div>
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-mist)]">
                  {r.method}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
                  {r.finding}
                </p>
              </div>
              <a
                href={r.href}
                className="link w-fit text-[0.875rem] text-[var(--color-mist)]"
              >
                Zenodo
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
