import { site } from '@/content/site'

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="shell">
        <div className="grid gap-[clamp(2.5rem,6vw,6rem)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="md:sticky md:top-28 md:self-start">
            <h2 id="about-heading" className="h2">
              About
            </h2>
            <p className="mt-5 max-w-[30ch] text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
              Based in {site.location}. Working across time zones with teams who
              care what the eleventh frame looks like.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              {site.about.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'max-w-[58ch] text-[clamp(1.0625rem,1rem+0.4vw,1.3rem)] leading-[1.55] text-[var(--color-bone)]'
                      : 'prose'
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <hr className="rule" />

            {/* Capabilities as a definition list: the term does real work. */}
            <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {site.capabilities.map((c) => (
                <div key={c.title} className="flex flex-col gap-2">
                  <dt className="h3">{c.title}</dt>
                  <dd className="m-0 text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
                    {c.body}
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                      {c.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-center gap-2 text-[0.8125rem] text-[var(--color-mist)] before:block before:size-[3px] before:shrink-0 before:rounded-full before:bg-[color-mix(in_oklab,var(--color-bone)_45%,transparent)] before:content-['']"
                        >
                          {it}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section aria-labelledby="experience-heading" className="section pt-0">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <h2 id="experience-heading" className="h3 md:pt-1">
            Where I&rsquo;ve worked
          </h2>

          <ol className="list-none p-0">
            {site.experience.map((r) => (
              <li
                key={r.company + r.period}
                className="grid gap-1 border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] py-6 last:border-b sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="tabular text-[0.875rem] text-[var(--color-haze)]">
                  {r.period}
                </span>
                <div>
                  <p className="text-[1.0625rem] font-medium text-[var(--color-bone)]">
                    {r.title}
                    <span className="font-normal text-[var(--color-haze)]">
                      {' '}
                      at {r.company}
                    </span>
                  </p>
                  <p className="mt-1 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
                    {r.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
